(() => {
  const state = { type: "all", role: "all" };
  const buttons = [...document.querySelectorAll(".gear-filter[data-gear-filter]")];
  const cards = [...document.querySelectorAll(".gear-preset-card")];
  const count = document.querySelector("#gearVisibleCount");
  const empty = document.querySelector("#gearEmpty");

  function applyFilters() {
    if (!cards.length) return;
    let visible = 0;
    cards.forEach((card) => {
      const typeOk = state.type === "all" || card.dataset.gearType === state.type;
      const roleOk = state.role === "all" || card.dataset.gearRole === state.role;
      const show = typeOk && roleOk;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible}개 표시`;
    if (empty) empty.hidden = visible !== 0;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.gearFilter;
      state[kind] = button.dataset.value;
      buttons
        .filter((other) => other.dataset.gearFilter === kind)
        .forEach((other) => other.classList.toggle("active", other === button));
      applyFilters();
    });
  });

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  document.querySelectorAll(".copy-share-code").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.dataset.code || "";
      if (!code) return;
      const original = button.innerHTML;
      try {
        await copyText(code);
        button.classList.add("copied");
        if (button.classList.contains("gear-guide-copy")) {
          const span = button.querySelector("span");
          if (span) span.textContent = "복사 완료 ✓";
        } else {
          button.textContent = "복사 완료 ✓";
        }
        window.setTimeout(() => {
          button.classList.remove("copied");
          button.innerHTML = original;
        }, 1700);
      } catch {
        button.textContent = code;
      }
    });
  });
})();