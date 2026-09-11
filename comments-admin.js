(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const dialog = byId("wa-dialog");
  let page = 1, total = 0, busy = false, items = [], selected = null;
  const labels = { pending: "승인 대기", published: "공개", hidden: "숨김" };
  const reasons = { spam: "광고·도배", abuse: "욕설·비방", misinformation: "잘못된 정보", other: "기타" };
  const formatter = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" });
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function status(message = "", kind = "") {
    byId("wa-status").textContent = message;
    byId("wa-status").dataset.kind = kind;
  }
  async function api(action, data) {
    let response;
    try {
      // Use POST for reads too: old PWA versions must never cache moderation data.
      response = await fetch("/admin/comments/api/" + action, {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "content-type": "application/json", "x-worwiki-request": "1" },
        body: JSON.stringify(data), signal: AbortSignal.timeout(15000)
      });
    } catch { throw new Error("NETWORK_ERROR"); }
    if (response.status === 401 || response.status === 403 || response.redirected) {
      throw new Error("관리자 인증이 만료되었거나 권한이 없습니다. 페이지를 새로고침해 다시 로그인해주세요.");
    }
    let result;
    try { result = await response.json(); }
    catch { throw new Error("관리자 응답을 확인하지 못했습니다. 페이지를 새로고침해주세요."); }
    if (!response.ok) throw new Error(result.error || "요청을 처리하지 못했습니다.");
    return result;
  }
  function message(error) {
    return error.message === "NETWORK_ERROR" ? "연결하지 못했습니다. 새로고침 후 상태를 확인해주세요." : error.message;
  }
  function controls(disabled) {
    for (const button of document.querySelectorAll(".ww-admin button")) button.disabled = disabled;
    byId("wa-filter").disabled = disabled;
    byId("wa-query").disabled = disabled;
    if (!disabled) {
      byId("wa-prev").disabled = page <= 1;
      byId("wa-next").disabled = page * 20 >= total;
    }
  }
  function button(text, className, handler) {
    const node = element("button", "ww-button " + className, text);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }
  function render() {
    const list = byId("wa-list");
    list.replaceChildren();
    for (const item of items) {
      const row = element("li", "ww-comment"), heading = element("div", "ww-heading");
      const link = element("a", "ww-hero-link", item.hero_name + " · " + item.hero_en);
      link.href = "/hero/" + encodeURIComponent(item.hero_id) + "/#hero-comments";
      link.target = "_blank"; link.rel = "noopener";
      const state = element("span", "ww-chip", labels[item.status]);
      state.dataset.state = item.status;
      heading.append(link, state);
      const meta = element("div", "ww-comment-meta");
      meta.append(element("strong", "", item.nickname));
      if (item.awakening !== null) meta.append(element("span", "ww-chip", item.awakening === 0 ? "무각" : item.awakening + "각"));
      const time = element("time", "", formatter.format(new Date(item.created_at * 1000)));
      time.dateTime = new Date(item.created_at * 1000).toISOString();
      meta.append(time);
      row.append(heading, meta, element("p", "ww-body", item.body));
      if (item.report_count) {
        row.append(element("p", "ww-report-note", "미처리 신고 " + item.report_count + "건 · " +
          (item.reasons || "").split(",").map(x => reasons[x] || "기타").join(", ")));
      }
      const actions = element("div", "ww-actions");
      if (item.status !== "published") actions.append(button("공개 승인", "ww-primary", () => moderate(item, "publish")));
      if (item.status !== "hidden") actions.append(button(item.status === "pending" ? "비공개 처리" : "숨김", "", () => moderate(item, "hide")));
      if (item.report_count) actions.append(button("신고 처리 완료", "", () => moderate(item, "resolve")));
      actions.append(button("삭제", "ww-danger", () => {
        selected = item;
        byId("wa-dialog-status").textContent = "";
        dialog.showModal();
      }));
      row.append(actions);
      list.append(row);
    }
    if (!items.length) list.append(element("li", "ww-empty", "해당하는 후기가 없습니다."));
    byId("wa-page").textContent = page + " / " + Math.max(1, Math.ceil(total / 20));
  }
  async function load() {
    if (busy) return;
    busy = true;
    controls(true);
    status("후기를 불러오는 중입니다.");
    try {
      const result = await api("list", { filter: byId("wa-filter").value, query: byId("wa-query").value, page });
      items = result.comments;
      total = result.total;
      for (const key of Object.keys(labels)) byId("wa-" + key).textContent = result.stats[key];
      byId("wa-reported").textContent = result.stats.reported;
      render();
      status(total + "개의 후기");
      return true;
    } catch (error) { status(message(error), "error"); return false; }
    finally { busy = false; controls(false); }
  }
  async function moderate(item, action) {
    if (busy) return;
    busy = true;
    controls(true);
    status("처리 중입니다.");
    try {
      await api("moderate", { id: item.id, action, version: item.version });
      if (dialog.open) dialog.close();
      // If this was the final item on a later page, return to the previous page.
      if (items.length === 1 && page > 1 && action !== "resolve") page--;
      busy = false;
      const refreshed = await load();
      status(refreshed
        ? { publish: "후기를 공개했습니다.", hide: "후기를 비공개 처리했습니다.", delete: "후기를 삭제했습니다.", resolve: "신고를 처리 완료했습니다." }[action]
        : "후기는 처리되었습니다. 목록을 다시 불러오려면 새로고침해주세요.", refreshed ? "success" : "error");
    } catch (error) {
      status(message(error), "error");
      if (dialog.open) byId("wa-dialog-status").textContent = message(error);
    } finally { busy = false; controls(false); }
  }
  byId("wa-refresh").addEventListener("click", () => load());
  byId("wa-search-form").addEventListener("submit", event => { event.preventDefault(); page = 1; load(); });
  byId("wa-filter").addEventListener("change", () => { page = 1; load(); });
  byId("wa-prev").addEventListener("click", () => { if (page > 1) { page--; load(); } });
  byId("wa-next").addEventListener("click", () => { if (page * 20 < total) { page++; load(); } });
  byId("wa-delete").addEventListener("click", () => { if (selected) moderate(selected, "delete"); });
  byId("wa-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", event => { if (busy) event.preventDefault(); });
  dialog.addEventListener("close", () => { selected = null; });
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistration().then(reg => reg?.update()).catch(() => {});
  load();
})();
