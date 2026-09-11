// Run with Node 22.13+ / no installed packages, no external requests.
// Executes the actual Worker using SQLite plus signed, generated Access tokens.
// Cloudflare's network services are simulated; live setup still needs verification.
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import worker from "../_worker.js";

const db = new DatabaseSync(":memory:");
db.exec(await readFile(new URL("../comments-schema.sql", import.meta.url), "utf8"));
// Verify that the initial schema may be applied twice without deleting data.
db.exec(await readFile(new URL("../comments-schema.sql", import.meta.url), "utf8"));
class Statement {
  constructor(sql, params=[]) { this.sql=sql; this.params=params; }
  bind(...args) { return new Statement(this.sql,args); }
  async first() { return db.prepare(this.sql).get(...this.params) || null; }
  async all() { return {results:db.prepare(this.sql).all(...this.params),success:true}; }
  async run() { const row=db.prepare(this.sql).run(...this.params); return {success:true,meta:{changes:Number(row.changes)}}; }
}
const d1 = {
  prepare: sql => new Statement(sql),
  async batch(statements) {
    db.exec("BEGIN IMMEDIATE");
    try { const result=[]; for(const statement of statements)result.push(await statement.run()); db.exec("COMMIT"); return result; }
    catch(error) { db.exec("ROLLBACK"); throw error; }
  }
};
const env = {
  COMMENTS_ENABLED:"true", COMMENTS_DB:d1,
  COMMENTS_SECRET:"TEST-ONLY-RANDOM-SECRET-NOT-A-PRODUCTION-CREDENTIAL-" + crypto.randomUUID(),
  TURNSTILE_SITE_KEY:"production-format-site-key-for-tests",
  TURNSTILE_SECRET_KEY:"production-format-secret-for-tests",
  ACCESS_TEAM_DOMAIN:"https://worwiki-tests.cloudflareaccess.com",
  ACCESS_AUD:"worwiki-test-audience", COMMENT_ADMIN_EMAILS:"moderator@example.invalid",
  ASSETS:{fetch:async()=>new Response("asset fallback")}
};
const pair=await crypto.subtle.generateKey({name:"RSASSA-PKCS1-v1_5",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},true,["sign","verify"]);
const jwk=await crypto.subtle.exportKey("jwk",pair.publicKey);
Object.assign(jwk,{kid:"test-key",use:"sig",alg:"RS256"});
const b64 = value => Buffer.from(typeof value==="string"?value:JSON.stringify(value)).toString("base64url");
async function jwt(patch={},headerPatch={}) {
  const now=Math.floor(Date.now()/1000);
  const header=b64({alg:"RS256",kid:"test-key",...headerPatch});
  const payload=b64({iss:env.ACCESS_TEAM_DOMAIN,aud:[env.ACCESS_AUD],email:env.COMMENT_ADMIN_EMAILS,sub:"test-admin",exp:now+3600,nbf:now-1,...patch});
  const signature=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",pair.privateKey,new TextEncoder().encode(header+"."+payload));
  return header+"."+payload+"."+Buffer.from(signature).toString("base64url");
}
const adminToken=await jwt();
const originalFetch=globalThis.fetch;
const usedTokens=new Set();
let challengeCalls=0;
globalThis.fetch=async(url,options={})=>{
  const href=String(url);
  if(href===env.ACCESS_TEAM_DOMAIN+"/cdn-cgi/access/certs")return Response.json({keys:[jwk]});
  if(href==="https://challenges.cloudflare.com/turnstile/v0/siteverify") {
    challengeCalls++;
    const body=JSON.parse(options.body), token=body.response;
    if(usedTokens.has(token))return Response.json({success:false});
    usedTokens.add(token);
    return Response.json({success:!token.startsWith("bad"),
      hostname:token.startsWith("host")?"elsewhere.invalid":"worwiki.kr",
      action:token.startsWith("report")?"comment_report":token.startsWith("action")?"other":"comment_submit"});
  }
  throw new Error("Unexpected network access: "+href);
};
const pending=[];
const ctx={waitUntil:promise=>pending.push(promise)};
async function request(path,{method="GET",body,cookie,admin=false,token=adminToken,origin="https://worwiki.kr",host="https://worwiki.kr",ip="192.0.2.1",headers={},config=env,raw}={}) {
  const h={"cf-connecting-ip":ip,...headers};
  if(method!=="GET"&&method!=="HEAD") {
    h.origin=origin; h["x-worwiki-request"]="1"; h["content-type"]="application/json";
  }
  if(cookie)h.cookie=cookie;
  if(admin)h["cf-access-jwt-assertion"]=token;
  return worker.fetch(new Request(host+path,{method,headers:h,body:raw!==undefined?raw:body===undefined?undefined:JSON.stringify(body)}),config,ctx);
}
async function json(path,options={}) {
  const response=await request(path,options);
  return {status:response.status,headers:response.headers,data:await response.json()};
}
async function session(ip) {
  const response=await request("/api/comments/session",{method:"POST",body:{},ip});
  assert.equal(response.status,200);
  const cookie=response.headers.get("set-cookie");
  assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);
  return cookie.split(";")[0];
}
const hero="abomination";
const newComment=(patch={})=>({id:crypto.randomUUID(),hero_id:hero,nickname:"테스트 유저",awakening:3,body:"일반 스테이지에서 사용해 본 후기입니다.",website:"",turnstile_token:"submit-"+crypto.randomUUID(),...patch});
const adminBody=body=>({method:"POST",body,admin:true});
let checks=0;
async function check(name,fn) { await fn(); checks++; console.log("PASS",name); }
try {
  await check("Default deployment keeps comments closed and the existing wiki usable",async()=>{
    assert.equal((await json("/api/comments/config",{config:{}})).data.enabled,false);
    const html=await (await request("/hero/"+hero+"/",{config:{}})).text();
    assert.ok(html.includes("증오")); assert.ok(!html.includes('id="hero-comments"'));
    assert.equal((await request("/api/comments",{method:"POST",body:{},config:{}})).status,503);
    assert.equal((await request("/admin/comments/",{config:{}})).status,503);
    assert.equal((await request("/")).status,200);
    assert.equal((await request("/gear-presets/")).headers.get("location"),"https://worwiki.kr/gear-presets-v4");
    assert.equal((await request("/gear-preset-401")).status,200);
  });
  await check("All 254 real hero pages render the new section when configured",async()=>{
    const heroes=JSON.parse(await readFile(new URL("../heroes.json",import.meta.url),"utf8"));
    assert.equal(heroes.length,254);
    for(const h of heroes) {
      const result=await request("/hero/"+h.id+"/");
      assert.equal(result.status,200,h.id);
      const html=await result.text();
      assert.ok(html.includes('id="hero-comments"'),h.id);
      assert.ok(html.includes('src="/comments.js?v=2.12.3"'),h.id);
      assert.ok(!html.includes(env.COMMENTS_SECRET));
    }
  });
  await check("Anonymous and forged administrator identities fail closed",async()=>{
    assert.equal((await request("/admin/comments/")).status,401);
    assert.equal((await json("/admin/comments/api/list",{method:"POST",body:{}})).status,401);
    const cases=[
      await jwt({email:"stranger@example.invalid"}),await jwt({aud:["wrong"]}),
      await jwt({iss:"https://other.cloudflareaccess.com"}),await jwt({exp:1}),
      await jwt({nbf:Math.floor(Date.now()/1000)+999}),await jwt({}, {alg:"none"}),
      adminToken.slice(0,-8)+"tampered"
    ];
    for(const token of cases)assert.equal((await request("/admin/comments/",{admin:true,token})).status,403);
    assert.equal((await request("/admin/comments/",{headers:{"cf-access-authenticated-user-email":env.COMMENT_ADMIN_EMAILS}})).status,401);
    assert.equal((await request("/admin/comments/",{host:"https://bypass.pages.dev"})).status,401);
    const ok=await request("/admin/comments/",{admin:true});
    assert.equal(ok.status,200); assert.match(ok.headers.get("cache-control"),/no-store/);
  });
  await check("Cross-origin requests and cross-host writes are rejected",async()=>{
    assert.equal((await request("/api/comments/session",{method:"POST",body:{},origin:"https://evil.invalid"})).status,403);
    assert.equal((await request("/api/comments/session",{method:"POST",body:{},host:"https://bypass.pages.dev"})).status,403);
    assert.equal((await json("/admin/comments/api/list",{...adminBody({}),origin:"https://evil.invalid"})).status,403);
    assert.equal((await request("/admin/comments/api/list",{admin:true})).status,405);
  });
  const author=await session("192.0.2.1"), other=await session("192.0.2.2");
  let comment=newComment();
  await check("A real SQLite submission stays pending and is visible only to its author/admin",async()=>{
    const result=await json("/api/comments",{method:"POST",body:comment,cookie:author});
    assert.equal(result.status,202);
    assert.equal((await json("/api/comments?hero="+hero)).data.comments.length,0);
    assert.equal((await json("/api/comments/mine",{method:"POST",body:{hero_id:hero},cookie:other})).data.comments.length,0);
    const mine=await json("/api/comments/mine",{method:"POST",body:{hero_id:hero},cookie:author});
    assert.equal(mine.data.comments[0].status,"pending"); assert.ok(!JSON.stringify(mine.data).includes("author_hash"));
    const list=await json("/admin/comments/api/list",adminBody({filter:"pending",query:"증오",page:1}));
    assert.equal(list.data.comments[0].id,comment.id);
    assert.equal(list.data.stats.pending,1);
    assert.ok(!JSON.stringify(list.data).includes("author_hash"));
    assert.match(list.headers.get("cache-control"),/no-store/);
  });
  await check("Retrying an accepted submission does not duplicate it",async()=>{
    const before=challengeCalls;
    assert.equal((await json("/api/comments",{method:"POST",body:comment,cookie:author})).status,202);
    assert.equal(challengeCalls,before);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM comments").get().n,1);
    assert.equal((await json("/api/comments",{method:"POST",body:{...comment,hero_id:"wrath"},cookie:author})).status,409);
  });
  await check("Rate limits hold across heroes and simultaneous submissions",async()=>{
    const outcome=await Promise.all([request("/api/comments",{method:"POST",body:newComment(),cookie:author}),
      request("/api/comments",{method:"POST",body:newComment({hero_id:"wrath"}),cookie:author})]);
    assert.deepEqual(outcome.map(x=>x.status),[429,429]);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM comments").get().n,1);
  });
  await check("Approval publishes; raw markup is never accepted; input is bounded",async()=>{
    const result=await json("/admin/comments/api/moderate",adminBody({id:comment.id,action:"publish",version:1}));
    assert.equal(result.status,200);
    const publicData=(await json("/api/comments?hero="+hero)).data;
    assert.equal(publicData.total,1);
    assert.equal(publicData.comments[0].body,comment.body);
    assert.ok(!JSON.stringify(publicData).includes("author_hash"));
    for(const body of [
      newComment({body:'<img src=x onerror=alert(1)>'}),newComment({body:"https://spam.invalid로 이동해주세요"}),
      newComment({nickname:"http://spam.invalid"}),newComment({body:"x".repeat(501)}),
      newComment({awakening:6}),newComment({website:"spam"}),newComment({hero_id:"__proto__"})
    ]) assert.ok([400,404].includes((await request("/api/comments",{method:"POST",body,cookie:other,ip:"192.0.2.2"})).status));
    assert.equal((await request("/api/comments",{method:"POST",raw:"x".repeat(12001),cookie:other})).status,413);
    assert.equal((await json("/api/comments?hero="+hero+"&cursor="+b64("null"))).status,400);
  });
  await check("Invalid, wrong-host, wrong-action and replayed bot tokens are rejected",async()=>{
    let n=10;
    for(const prefix of ["bad","host","action","report"]) {
      const ip="192.0.2."+n++, cookie=await session(ip);
      assert.equal((await request("/api/comments",{method:"POST",body:newComment({turnstile_token:prefix+"-"+crypto.randomUUID()}),cookie,ip})).status,400);
    }
    const ip="192.0.2.20",cookie=await session(ip);
    assert.equal((await request("/api/comments",{method:"POST",body:newComment({turnstile_token:comment.turnstile_token}),cookie,ip})).status,400);
    const dummy={...env,TURNSTILE_SITE_KEY:"1x00000000000000000000AA"};
    assert.equal((await json("/api/comments/config",{config:dummy})).data.enabled,false);
  });
  await check("Reporting, hidden state, stale-version protection, and audit transactions work",async()=>{
    const report=await json("/api/comments/"+comment.id+"/report",{method:"POST",body:{reason:"spam",turnstile_token:"report-"+crypto.randomUUID()},cookie:other,ip:"192.0.2.2"});
    assert.equal(report.status,202);
    let data=(await json("/admin/comments/api/list",adminBody({filter:"reported"}))).data;
    assert.equal(data.comments[0].report_count,1);
    assert.equal((await json("/admin/comments/api/moderate",adminBody({id:comment.id,action:"hide",version:1}))).status,409);
    assert.equal(db.prepare("SELECT status FROM comments WHERE id=?").get(comment.id).status,"published");
    assert.equal((await json("/admin/comments/api/moderate",adminBody({id:comment.id,action:"hide",version:2}))).status,200);
    assert.equal((await json("/api/comments?hero="+hero)).data.total,0);
    assert.equal((await json("/admin/comments/api/list",adminBody({filter:"reported"}))).data.stats.reported,0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM comment_moderation_log").get().n,2);
  });
  await check("Owner deletion rejects another browser, removes reports, and handles repeated deletion",async()=>{
    assert.equal((await json("/api/comments/"+comment.id,{method:"DELETE",body:{},cookie:other})).status,404);
    assert.equal((await json("/api/comments/"+comment.id,{method:"DELETE",body:{},cookie:author})).status,200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM comment_reports").get().n,0);
    assert.equal((await json("/api/comments/"+comment.id,{method:"DELETE",body:{},cookie:author})).status,404);
  });
  await check("Admin deletion and nickname search use bound SQL, with a persistent audit trail",async()=>{
    const ip="192.0.2.30",cookie=await session(ip);
    const c=newComment({nickname:"작은'후기"});
    assert.equal((await json("/api/comments",{method:"POST",body:c,cookie,ip})).status,202);
    const found=await json("/admin/comments/api/list",adminBody({query:"작은'후기"}));
    assert.equal(found.data.comments.length,1);
    assert.equal((await json("/admin/comments/api/list",adminBody({query:"' OR 1=1 --"}))).data.total,0);
    assert.equal((await json("/admin/comments/api/moderate",adminBody({id:c.id,action:"delete",version:1}))).status,200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM comments").get().n,0);
    assert.equal(db.prepare("SELECT action FROM comment_moderation_log WHERE comment_id=?").get(c.id).action,"delete");
  });
  await check("Only one of two simultaneous fresh submissions is accepted",async()=>{
    const ip="192.0.2.40",a=await session(ip),b=await session(ip);
    const results=await Promise.all([
      request("/api/comments",{method:"POST",body:newComment(),cookie:a,ip}),
      request("/api/comments",{method:"POST",body:newComment(),cookie:b,ip})
    ]);
    assert.deepEqual(results.map(x=>x.status).sort(),[202,429]);
  });
  await check("Pagination has no duplicates, stays hero-scoped, and uses the public index",async()=>{
    for(let i=0;i<25;i++)db.prepare("INSERT INTO comments(id,hero_id,nickname,body,status,author_hash,created_at,published_at,updated_at) VALUES(?,?,?,?,'published',?,1,1,1)")
      .run(crypto.randomUUID(),hero,"테스트","페이지 확인용 가상 후기입니다.","test-only");
    const first=(await json("/api/comments?hero="+hero)).data;
    const second=(await json("/api/comments?hero="+hero+"&cursor="+first.next)).data;
    assert.equal(first.comments.length,20); assert.equal(second.comments.length,5);
    assert.equal(new Set([...first.comments,...second.comments].map(x=>x.id)).size,25);
    assert.equal((await json("/api/comments?hero=wrath")).data.total,0);
    const plan=db.prepare("EXPLAIN QUERY PLAN SELECT id FROM comments WHERE hero_id=? AND status='published' ORDER BY published_at DESC,id DESC LIMIT 21").all(hero);
    assert.ok(plan.some(x=>x.detail.includes("idx_comments_public")));
  });
  await Promise.all(pending);
  console.log("\n"+checks+" scenario groups passed. Live D1/Access/Turnstile and browser rendering are not covered.");
} finally { globalThis.fetch=originalFetch; db.close(); }
