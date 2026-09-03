const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const heroGrid = document.querySelector("#heroGrid");
const emptyState = document.querySelector("#emptyState");
const visibleCount = document.querySelector("#visibleCount");
const resultSummary = document.querySelector("#resultSummary");

let heroes = [];
const active = { rarity: "all", class: "all" };

const normalize = (value = "") =>
  value.toString().toLowerCase().normalize("NFKC").replace(/\s+/g, "").trim();

function matchesSearch(hero, query) {
  if (!query) return true;
  const haystack = [
    hero.nameKr,
    hero.nameEn,
    ...(hero.aliases || [])
  ].map(normalize).join(" ");
  return haystack.includes(normalize(query));
}

function rarityClass(rarity) {
  if (rarity === "전설") return "legendary";
  if (rarity === "에픽") return "epic";
  if (rarity === "레어") return "rare";
  return "unknown";
}

function card(hero) {
  const initial = (hero.nameEn || hero.nameKr).trim().charAt(0).toUpperCase();
  return `
    <article class="hero-card">
      <div class="card-visual">
        ${hero.portrait
          ? `<img src="${hero.portrait}" alt="${hero.nameKr} (${hero.nameEn}) 영웅 카드" loading="lazy">`
          : `<span>${initial}</span>`}
      </div>
      <div class="card-body">
        <div class="card-topline">
          ${hero.lord ? '<span class="tag lord">영주</span>' : ''}
          <span class="tag ${rarityClass(hero.rarity)}">${hero.rarity}</span>
        </div>
        <h3>${hero.nameKr}</h3>
        <p class="en">${hero.nameEn}</p>
        <p class="meta">${hero.class} · ${hero.factionKr}</p>
      </div>
    </article>
  `;
}

function render() {
  const query = searchInput.value;
  const filtered = heroes.filter(hero =>
    hero.faction === "watch-guard" &&
    matchesSearch(hero, query) &&
    (active.rarity === "all" || hero.rarity === active.rarity) &&
    (active.class === "all" || hero.class === active.class)
  );

  heroGrid.innerHTML = filtered.map(card).join("");
  emptyState.hidden = filtered.length !== 0;
  visibleCount.textContent = filtered.length;

  if (query.trim() || active.rarity !== "all" || active.class !== "all") {
    resultSummary.textContent = `조건에 맞는 영웅 ${filtered.length}명 · 전체 등록 40명`;
  } else {
    resultSummary.textContent = "파수꾼 소대 영웅 40명 등록 완료";
  }
}

fetch("./heroes.json")
  .then(r => {
    if (!r.ok) throw new Error("heroes.json load failed");
    return r.json();
  })
  .then(data => {
    heroes = data.sort((a,b) => a.sortOrder - b.sortOrder);
    render();
  })
  .catch(err => {
    console.error(err);
    resultSummary.textContent = "영웅 데이터를 불러오지 못했습니다.";
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  // 이름 검색을 시작하는 순간 기존 희귀도/직업 필터를 전체로 초기화.
  // 필터 때문에 검색 대상 영웅이 숨는 상황을 방지한다.
  if (query) {
    active.rarity = "all";
    active.class = "all";

    document
      .querySelectorAll('.filter[data-filter-type="rarity"]')
      .forEach((button) => {
        button.classList.toggle("active", button.dataset.value === "all");
      });

    document
      .querySelectorAll('.filter[data-filter-type="class"]')
      .forEach((button) => {
        button.classList.toggle("active", button.dataset.value === "all");
      });
  }

  render();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  render();
  searchInput.focus();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.filterType;
    active[type] = button.dataset.value;

    document
      .querySelectorAll(`.filter[data-filter-type="${type}"]`)
      .forEach(b => b.classList.toggle("active", b === button));

    render();
  });
});


// ---------------------------
// PWA install / home-screen flow
// ---------------------------
let deferredInstallPrompt = null;

const installAppButton = document.querySelector("#installAppButton");
const installModal = document.querySelector("#installModal");
const installModalBody = document.querySelector("#installModalBody");
const installModalAction = document.querySelector("#installModalAction");

const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function openInstallModal(mode = "install") {
  if (!installModal) return;

  installModal.hidden = false;
  document.body.classList.add("modal-open");

  if (mode === "ios") {
    installModalBody.innerHTML = `
      <p>아이폰·아이패드 Safari에서는 아래 순서로 추가할 수 있습니다.</p>
      <ol>
        <li>Safari 아래쪽의 <strong>공유 버튼</strong>을 누릅니다.</li>
        <li><strong>홈 화면에 추가</strong>를 선택합니다.</li>
        <li>오른쪽 위 <strong>추가</strong>를 누르면 완료됩니다.</li>
      </ol>
    `;
    installModalAction.textContent = "확인";
  } else {
    installModalBody.innerHTML = `
      <p>홈 화면에 <strong>나만겜 영웅도감</strong> 아이콘을 추가하고 앱처럼 바로 실행할 수 있습니다.</p>
      <p class="install-note">설치해도 별도 회원가입은 필요하지 않습니다.</p>
    `;
    installModalAction.textContent = deferredInstallPrompt ? "지금 설치" : "확인";
  }
}

function closeInstallModal() {
  if (!installModal) return;
  installModal.hidden = true;
  document.body.classList.remove("modal-open");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppButton && !isStandalone) {
    installAppButton.classList.add("ready");
  }
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  closeInstallModal();
  if (installAppButton) {
    installAppButton.classList.add("installed");
    installAppButton.innerHTML = "<span>✓ 설치됨</span>";
  }
});

if (installAppButton) {
  if (isStandalone) {
    installAppButton.classList.add("installed");
    installAppButton.innerHTML = "<span>✓ 설치됨</span>";
  }

  installAppButton.addEventListener("click", async () => {
    if (isStandalone) return;

    if (isIOS) {
      openInstallModal("ios");
      return;
    }

    if (deferredInstallPrompt) {
      openInstallModal("install");
      return;
    }

    openInstallModal("install");
  });
}

if (installModalAction) {
  installModalAction.addEventListener("click", async () => {
    if (isIOS || !deferredInstallPrompt) {
      closeInstallModal();
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    closeInstallModal();

    await promptEvent.prompt();
    await promptEvent.userChoice;
  });
}

document.querySelectorAll("[data-close-install]").forEach((el) => {
  el.addEventListener("click", closeInstallModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && installModal && !installModal.hidden) {
    closeInstallModal();
  }
});

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
