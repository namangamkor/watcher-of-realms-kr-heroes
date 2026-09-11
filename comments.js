(() => {
  "use strict";
  const root = document.getElementById("hero-comments");
  if (!root) return;
  const byId = id => document.getElementById(id);
  const hero = root.dataset.heroId, siteKey = root.dataset.siteKey;
  const form = byId("ww-form"), submit = byId("ww-submit"), dialog = byId("ww-dialog");
  let entries = [], mine = [], cursor = null, total = 0, loading = false;
  let captchaPromise = null, formWidget = null, reportWidget = null;
  let formToken = "", reportToken = "", formBusy = false, dialogBusy = false;
  let currentDialog = null, requestSnapshot = null;
  const dateFormat = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" });

  function status(id, message = "", kind = "") {
    const element = byId(id);
    element.textContent = message;
    element.dataset.kind = kind;
  }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  async function api(path, method = "GET", body) {
    let response;
    try {
      response = await fetch(path, {
        method, credentials: "same-origin", cache: "no-store",
        headers: method === "GET" ? {} : { "content-type": "application/json", "x-worwiki-request": "1" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(15000)
      });
    } catch { throw new Error("연결하지 못했어요. 입력 내용은 그대로 두고 다시 시도해주세요."); }
    let data;
    try { data = await response.json(); }
    catch { throw new Error("응답을 확인하지 못했어요. 잠시 후 다시 시도해주세요."); }
    if (!response.ok) throw new Error(data.error || "요청을 처리하지 못했어요.");
    return data;
  }
  function renderComment(comment, privateRow = false) {
    const row = node("li", "ww-comment"), meta = node("div", "ww-comment-meta");
    meta.append(node("strong", "", comment.nickname));
    if (comment.awakening !== null) meta.append(node("span", "ww-chip", comment.awakening === 0 ? "무각" : comment.awakening + "각"));
    if (privateRow) {
      const state = node("span", "ww-chip", comment.status === "pending" ? "승인 대기" : "숨김");
      state.dataset.state = comment.status;
      meta.append(state);
    }
    const time = node("time", "", dateFormat.format(new Date(comment.created_at * 1000)));
    time.dateTime = new Date(comment.created_at * 1000).toISOString();
    meta.append(time);
    row.append(meta, node("p", "ww-body", comment.body));
    const actions = node("div", "ww-actions");
    const owned = privateRow || mine.some(x => x.id === comment.id);
    const action = node("button", "ww-button ww-quiet", owned ? "내 후기 삭제" : "신고");
    action.type = "button";
    action.addEventListener("click", () => openDialog(owned ? "delete" : "report", comment.id));
    actions.append(action);
    row.append(actions);
    return row;
  }
  function renderLists() {
    const list = byId("ww-list");
    list.replaceChildren(...entries.map(x => renderComment(x)));
    if (!entries.length) list.append(node("li", "ww-empty", "첫 사용 후기를 남겨주세요."));
    byId("ww-count").textContent = "(" + total + ")";
    const privateRows = mine.filter(x => x.status !== "published");
    byId("ww-mine").hidden = !privateRows.length;
    byId("ww-mine-list").replaceChildren(...privateRows.map(x => renderComment(x, true)));
    byId("ww-more").hidden = !cursor;
  }
  async function load(append = false) {
    if (loading) return;
    loading = true;
    byId("ww-more").disabled = true;
    byId("ww-retry").hidden = true;
    status("ww-load-status", "후기를 불러오는 중입니다.");
    try {
      // A unique URL also avoids stale reads from an older installed service worker.
      const params = new URLSearchParams({ hero, v: String(Date.now()) });
      if (append && cursor) params.set("cursor", cursor);
      const data = await api("/api/comments?" + params);
      entries = append ? [...entries, ...data.comments.filter(x => !entries.some(y => y.id === x.id))] : data.comments;
      total = data.total;
      cursor = data.next;
      try {
        // POST deliberately avoids caches from pre-comments PWA versions.
        const own = await api("/api/comments/mine", "POST", { hero_id: hero, visible_ids: entries.map(x => x.id).slice(-100) });
        mine = own.comments;
      } catch { mine = []; }
      renderLists();
      status("ww-load-status");
    } catch (error) {
      status("ww-load-status", error.message, "error");
      byId("ww-retry").hidden = false;
    } finally {
      loading = false;
      byId("ww-more").disabled = false;
    }
  }
  function sdk() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (captchaPromise) return captchaPromise;
    captchaPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        script.remove();
        reject(new Error("로봇 확인을 불러오지 못했어요. 인터넷 연결을 확인한 후 다시 열어주세요."));
      }, 12000);
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => {
        clearTimeout(timer);
        if (!window.turnstile) { reject(new Error("로봇 확인을 다시 시도해주세요.")); return; }
        window.turnstile.ready(() => resolve(window.turnstile));
      };
      script.onerror = () => {
        clearTimeout(timer);
        script.remove();
        reject(new Error("로봇 확인을 불러오지 못했어요. 인터넷 연결을 확인한 후 다시 열어주세요."));
      };
      document.head.append(script);
    }).catch(error => { captchaPromise = null; throw error; });
    return captchaPromise;
  }
  function syncSubmit() { submit.disabled = formBusy || !formToken; }
  async function startForm() {
    if (formWidget !== null) return;
    try {
      await api("/api/comments/session", "POST", {});
      const turnstile = await sdk();
      if (formWidget !== null) return;
      formWidget = turnstile.render(byId("ww-captcha"), {
        sitekey: siteKey, action: "comment_submit", theme: "dark", size: "compact",
        callback: token => { formToken = token; syncSubmit(); },
        "expired-callback": () => { formToken = ""; syncSubmit(); status("ww-submit-status", "로봇 확인을 다시 완료해주세요."); },
        "error-callback": () => { formToken = ""; syncSubmit(); status("ww-submit-status", "로봇 확인을 다시 시도해주세요.", "error"); }
      });
    } catch (error) { status("ww-submit-status", error.message, "error"); }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (formBusy || !formToken || !form.reportValidity()) return;
    const values = {
      hero_id: hero,
      nickname: byId("ww-nickname").value,
      awakening: byId("ww-awakening").value === "" ? null : Number(byId("ww-awakening").value),
      body: byId("ww-body").value,
      website: form.elements.website.value
    };
    const snapshot = JSON.stringify(values);
    if (!requestSnapshot || requestSnapshot.value !== snapshot) requestSnapshot = { value: snapshot, id: crypto.randomUUID() };
    formBusy = true;
    syncSubmit();
    status("ww-submit-status", "후기를 접수하고 있어요.");
    try {
      const data = await api("/api/comments", "POST", { ...values, id: requestSnapshot.id, turnstile_token: formToken });
      byId("ww-body").value = "";
      byId("ww-counter").textContent = "0 / 500";
      requestSnapshot = null;
      status("ww-submit-status", data.message, "success");
      await load();
    } catch (error) { status("ww-submit-status", error.message, "error"); }
    finally {
      formBusy = false;
      formToken = "";
      if (window.turnstile && formWidget !== null) window.turnstile.reset(formWidget);
      syncSubmit();
    }
  });
  async function openDialog(mode, id) {
    currentDialog = { mode, id };
    const title = mode === "report" ? "후기 신고" : "내 후기를 삭제할까요?";
    byId("ww-dialog-title").textContent = title;
    byId("ww-dialog-copy").textContent = mode === "report" ? "관리자가 신고 내용을 확인합니다." : "삭제한 후기는 복구할 수 없습니다.";
    byId("ww-reason-field").hidden = mode !== "report";
    byId("ww-report-captcha").hidden = mode !== "report";
    const confirm = byId("ww-dialog-confirm");
    confirm.textContent = mode === "report" ? "신고 접수" : "삭제";
    confirm.disabled = mode === "report";
    status("ww-dialog-status");
    dialog.showModal();
    if (mode === "report") {
      try {
        const turnstile = await sdk();
        if (!dialog.open || currentDialog?.id !== id || currentDialog.mode !== mode) return;
        reportWidget = turnstile.render(byId("ww-report-captcha"), {
          sitekey: siteKey, action: "comment_report", theme: "dark", size: "compact",
          callback: token => { reportToken = token; confirm.disabled = dialogBusy; },
          "expired-callback": () => { reportToken = ""; confirm.disabled = true; },
          "error-callback": () => { reportToken = ""; confirm.disabled = true; status("ww-dialog-status", "로봇 확인을 다시 시도해주세요.", "error"); }
        });
      } catch (error) { status("ww-dialog-status", error.message, "error"); }
    }
  }
  byId("ww-dialog-confirm").addEventListener("click", async () => {
    if (!currentDialog || dialogBusy) return;
    const { mode, id } = currentDialog;
    if (mode === "report" && !reportToken) return;
    dialogBusy = true;
    byId("ww-dialog-confirm").disabled = true;
    byId("ww-dialog-cancel").disabled = true;
    status("ww-dialog-status", "처리 중입니다.");
    try {
      const result = await api("/api/comments/" + encodeURIComponent(id) + (mode === "report" ? "/report" : ""),
        mode === "report" ? "POST" : "DELETE",
        mode === "report" ? { reason: byId("ww-reason").value, turnstile_token: reportToken } : {});
      dialog.close();
      await load();
      status("ww-load-status", mode === "report" ? result.message : "내 후기를 삭제했어요.", "success");
    } catch (error) {
      status("ww-dialog-status", error.message, "error");
      if (mode === "report" && window.turnstile && reportWidget !== null) {
        reportToken = "";
        window.turnstile.reset(reportWidget);
      }
    } finally {
      dialogBusy = false;
      byId("ww-dialog-cancel").disabled = false;
      byId("ww-dialog-confirm").disabled = mode === "report" && !reportToken;
    }
  });
  byId("ww-dialog-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", event => { if (dialogBusy) event.preventDefault(); });
  dialog.addEventListener("close", () => {
    if (window.turnstile && reportWidget !== null) window.turnstile.remove(reportWidget);
    reportWidget = null;
    reportToken = "";
    currentDialog = null;
  });
  byId("ww-body").addEventListener("input", () => { byId("ww-counter").textContent = byId("ww-body").value.length + " / 500"; });
  byId("ww-compose").addEventListener("toggle", () => { if (byId("ww-compose").open) startForm(); });
  byId("ww-more").addEventListener("click", () => load(true));
  byId("ww-retry").addEventListener("click", () => load());
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistration().then(reg => reg?.update()).catch(() => {});
  load();
})();
