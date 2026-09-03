const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const heroGrid = document.querySelector("#heroGrid");
const emptyState = document.querySelector("#emptyState");
const visibleCount = document.querySelector("#visibleCount");
const totalCount = document.querySelector("#totalCount");
const resultSummary = document.querySelector("#resultSummary");
const rosterKicker = document.querySelector("#rosterKicker");
const rosterTitle = document.querySelector("#rosterTitle");
const dataNote = document.querySelector("#dataNote");
const factionButtons = document.querySelectorAll(".faction-card[data-faction]");

let heroes = [];
let currentFaction = "watch-guard";
const active = { rarity: "all", class: "all" };

const factionMeta = {
  "watch-guard": {
    kr: "파수꾼 소대",
    en: "Watch Guard",
    total: 40
  },
  "north-throne": {
    kr: "북쪽 경계 왕좌",
    en: "North Throne",
    total: 49
  },
  "nightmare-council": {
    kr: "악몽 의회",
    en: "Nightmare Council",
    total: 39
  },
  "cursed-cult": {
    kr: "저주신교",
    en: "Cursed Cult",
    total: 40
  },
  "infernal-blast": {
    kr: "연옥 폭파",
    en: "Infernal Blast",
    total: 33
  },
  "star-piercers": {
    kr: "관성의 화살",
    en: "Star Piercers",
    total: 44
  },
  "esoteria-order": {
    kr: "비법회",
    en: "Esoteria Order",
    total: 48
  },
  "chaos-dominion": {
    kr: "혼돈 정복자",
    en: "Chaos Dominion",
    total: 27
  },
  "supreme-arbiters": {
    kr: "최고 중재자",
    en: "Supreme Arbiters",
    total: 22
  },
  "unnamable": {
    kr: "알 수 없는 자",
    en: "Unnamable",
    total: 2
  }
};

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
  if (rarity === "일반") return "common";
  return "unknown";
}

function getMembership(hero, factionId) {
  return (hero.memberships || []).find(
    (membership) => membership.faction === factionId
  );
}

function getPrimaryMembership(hero) {
  return (hero.memberships || [])[0] || null;
}

function getFactionNames(hero) {
  return (hero.memberships || [])
    .map((membership) => membership.factionKr)
    .filter(Boolean)
    .join(" · ");
}

function card(hero, membership, searchMode = false) {
  const initial = (hero.nameEn || hero.nameKr).trim().charAt(0).toUpperCase();
  const memberships = hero.memberships || [];
  const isMultiFaction = memberships.length > 1;
  const factionNames = getFactionNames(hero);
  const showLord = searchMode
    ? memberships.some((item) => item.lord)
    : Boolean(membership?.lord);

  return `
    <article class="hero-card">
      <div class="card-visual">
        ${membership?.portrait
          ? `<img src="${membership.portrait}" alt="${hero.nameKr} (${hero.nameEn}) 영웅 카드" loading="lazy">`
          : `<span>${initial}</span>`}
      </div>
      <div class="card-body">
        <div class="card-topline">
          ${showLord ? '<span class="tag lord">영주</span>' : ''}
          <span class="tag ${rarityClass(hero.rarity)}">${hero.rarity}</span>
          ${isMultiFaction
            ? `<span class="tag dual" title="${factionNames}">이중 진영</span>`
            : ''}
        </div>
        <h3>${hero.nameKr}</h3>
        <p class="en">${hero.nameEn}</p>
        <p class="meta">${hero.class} · ${searchMode ? factionNames : (membership?.factionKr || "")}</p>
      </div>
    </article>
  `;
}

function setAllFilters() {
  active.rarity = "all";
  active.class = "all";

  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.value === "all");
  });
}

function setFactionButtonState(searchMode) {
  factionButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      !searchMode && button.dataset.faction === currentFaction
    );
  });
}

function updateFactionHeader(meta) {
  if (rosterKicker) rosterKicker.textContent = meta.en.toUpperCase();
  if (rosterTitle) rosterTitle.textContent = meta.kr;
  if (totalCount) totalCount.textContent = meta.total;

  if (dataNote) {
    dataNote.textContent =
      `${meta.kr} ${meta.total}명 등록 완료 · 이중 진영 영웅도 각 진영에서 정상 표시됩니다.`;
  }
}

function updateSearchHeader(query, resultCount) {
  if (rosterKicker) rosterKicker.textContent = "HERO SEARCH";
  if (rosterTitle) rosterTitle.textContent = "영웅 검색 결과";
  if (totalCount) totalCount.textContent = heroes.length;

  if (resultSummary) {
    resultSummary.textContent =
      `"${query}" 검색 결과 ${resultCount}명 · 등록 영웅 ${heroes.length}명`;
  }

  if (dataNote) {
    dataNote.textContent =
      "전 진영 통합 검색 · 이중 진영 영웅은 한 번만 표시되고 모든 소속 진영을 함께 보여줍니다.";
  }
}

function render() {
  const query = searchInput.value.trim();
  const isSearchMode = Boolean(query);

  setFactionButtonState(isSearchMode);

  if (isSearchMode) {
    const filtered = heroes
      .filter((hero) =>
        matchesSearch(hero, query) &&
        (active.rarity === "all" || hero.rarity === active.rarity) &&
        (active.class === "all" || hero.class === active.class)
      )
      .sort((a, b) => a.nameKr.localeCompare(b.nameKr, "ko"));

    updateSearchHeader(query, filtered.length);

    heroGrid.innerHTML = filtered
      .map((hero) => card(hero, getPrimaryMembership(hero), true))
      .join("");

    emptyState.hidden = filtered.length !== 0;
    visibleCount.textContent = filtered.length;
    return;
  }

  const meta = factionMeta[currentFaction];

  const filtered = heroes
    .map((hero) => ({
      hero,
      membership: getMembership(hero, currentFaction)
    }))
    .filter(({ hero, membership }) =>
      Boolean(membership) &&
      (active.rarity === "all" || hero.rarity === active.rarity) &&
      (active.class === "all" || hero.class === active.class)
    )
    .sort((a, b) => a.membership.sortOrder - b.membership.sortOrder);

  updateFactionHeader(meta);

  heroGrid.innerHTML = filtered
    .map(({ hero, membership }) => card(hero, membership, false))
    .join("");

  emptyState.hidden = filtered.length !== 0;
  visibleCount.textContent = filtered.length;

  if (active.rarity !== "all" || active.class !== "all") {
    resultSummary.textContent =
      `조건에 맞는 영웅 ${filtered.length}명 · 전체 등록 ${meta.total}명`;
  } else {
    resultSummary.textContent = `${meta.kr} 영웅 ${meta.total}명 등록 완료`;
  }
}

fetch("./heroes.json?v=2.5")
  .then((response) => {
    if (!response.ok) throw new Error("heroes.json load failed");
    return response.json();
  })
  .then((data) => {
    heroes = data;
    render();
  })
  .catch((error) => {
    console.error(error);
    resultSummary.textContent = "영웅 데이터를 불러오지 못했습니다.";
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  // 이름 검색은 전 진영 통합 검색 모드.
  // 검색을 시작하는 순간 기존 희귀도/직업 필터를 전체로 초기화한다.
  if (query) {
    setAllFilters();
  }

  render();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  setAllFilters();
  render();
  searchInput.focus();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.filterType;
    active[type] = button.dataset.value;

    document
      .querySelectorAll(`.filter[data-filter-type="${type}"]`)
      .forEach((candidate) =>
        candidate.classList.toggle("active", candidate === button)
      );

    render();
  });
});

factionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFaction = button.dataset.faction;

    // 진영 버튼을 누르면 검색 모드를 종료하고 해당 진영 도감으로 이동한다.
    searchInput.value = "";
    setAllFilters();
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

const ua = window.navigator.userAgent || "";
const isIOS = /iphone|ipad|ipod/i.test(ua);
const isAndroid = /android/i.test(ua);
const isKakaoInApp = /KAKAOTALK/i.test(ua);
const isAndroidWebView = /;\s*wv\)/i.test(ua) || /\bwv\b/i.test(ua);
const isOtherInApp =
  /NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp/i.test(ua);
const isInAppBrowser = isKakaoInApp || isAndroidWebView || isOtherInApp;

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function openInstallModal(mode = "install") {
  if (!installModal) return;

  installModal.hidden = false;
  document.body.classList.add("modal-open");

  if (mode === "inapp") {
    installModalBody.innerHTML = `
      <p><strong>지금은 앱 안의 브라우저로 열려 있어서 바로 설치할 수 없습니다.</strong></p>
      <p>현재 화면의 <strong>⋮ 메뉴</strong>를 누른 뒤
      <strong>Chrome에서 열기</strong> 또는 <strong>다른 브라우저에서 열기</strong>를 선택하세요.</p>
      <p>Chrome에서 이 사이트를 다시 열고 <strong>폰에 도감 추가</strong>를 누르면 설치할 수 있습니다.</p>
      <p class="install-note">카카오톡, 일부 메신저·앱 내부 브라우저에서는 PWA 설치 기능이 제한될 수 있습니다.</p>
    `;
    installModalAction.textContent = "확인";
    return;
  }

  if (mode === "ios") {
    installModalBody.innerHTML = `
      <p>아이폰·아이패드에서는 <strong>Safari</strong>로 열어주세요.</p>
      <ol>
        <li>Safari의 <strong>공유 버튼</strong>을 누릅니다.</li>
        <li><strong>홈 화면에 추가</strong>를 선택합니다.</li>
        <li>오른쪽 위 <strong>추가</strong>를 누르면 완료됩니다.</li>
      </ol>
    `;
    installModalAction.textContent = "확인";
    return;
  }

  if (mode === "manual") {
    installModalBody.innerHTML = `
      <p>브라우저가 자동 설치창을 아직 준비하지 않았습니다.</p>
      <p>Chrome 오른쪽 위 <strong>⋮ 메뉴</strong>에서
      <strong>앱 설치</strong> 또는 <strong>홈 화면에 추가</strong>를 선택해보세요.</p>
      <p class="install-note">잠시 후 페이지를 새로고침하면 설치 버튼이 활성화되는 경우도 있습니다.</p>
    `;
    installModalAction.textContent = "확인";
    return;
  }

  installModalBody.innerHTML = `
    <p>홈 화면에 <strong>나만겜 영웅도감</strong> 아이콘을 추가하고 앱처럼 바로 실행할 수 있습니다.</p>
    <p class="install-note">설치해도 별도 회원가입은 필요하지 않습니다.</p>
  `;
  installModalAction.textContent = "지금 설치";
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

  installAppButton.addEventListener("click", () => {
    if (isStandalone) return;

    if (isInAppBrowser) {
      openInstallModal("inapp");
      return;
    }

    if (isIOS) {
      openInstallModal("ios");
      return;
    }

    if (deferredInstallPrompt) {
      openInstallModal("install");
      return;
    }

    openInstallModal("manual");
  });
}

if (installModalAction) {
  installModalAction.addEventListener("click", async () => {
    if (
      isInAppBrowser ||
      isIOS ||
      !deferredInstallPrompt ||
      installModalAction.textContent !== "지금 설치"
    ) {
      closeInstallModal();
      return;
    }

    const promptEvent = deferredInstallPrompt;
    closeInstallModal();

    await promptEvent.prompt();
    await promptEvent.userChoice;

    deferredInstallPrompt = null;
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
