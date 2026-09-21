// Latest editorial update first. Move a hero to the front after a meaningful information update.
// Initial order supplied by the site owner; no historical update dates are inferred.
// User-confirmed 우우 refers to 루루.
const HERO_UPDATE_ORDER = [
  "어둠의 에지오",
  "이비 프라이",
  "바예크",
  "에이보르",
  "카산드라",
  "에지오 아디토레",
  "카이난",
  "지제벨",
  "베라",
  "루루",
  "클라리사",
  "고결",
  "소설백",
  "제누스",
  "오렌",
  "솔라리스",
  "어둠의총사데인",
  "해골그림자회색수염",
  "굴드락",
  "아키라",
  "비올레타베인",
  "그레첸",
  "관우",
  "세르게이",
  "로살리아",
  "피에르",
  "루은호로",
  "카드그림",
  "에드린",
  "레이븐홀드",
  "레이칸",
  "미나",
  "드라큘라",
  "반헬싱",
  "케인",
  "에일리스",
  "시슬라",
  "나타",
  "이랑신",
  "드레린",
  "발레리아",
  "아스트레이",
  "모리던",
  "네리사",
  "나스티야",
  "누메라"
];
const HERO_PREVIOUS_ORDER = ["가드리엘", "가안", "격노", "고결", "관우", "군바", "굴드락", "그레시우스", "그레첸", "그웬돌린", "나블레스", "나사트", "나스티야", "나짐", "나타", "네로", "네리사", "녹턴", "누메라", "니상드", "닉스", "다그나", "다스미", "달리아", "달린", "데모스", "데미", "데시무스", "델로레스", "두르가", "드라큘라", "드레가", "드레린", "드로고", "디몽", "디오웬", "라야", "라우렐", "라이라", "라트로크", "러스트", "레고", "레굴라스", "레이든", "레이븐홀드", "레이저", "레이칸", "레자겔", "렉스", "로살리아", "로크", "로크스", "루가르", "루나레아", "루루", "루시우스", "루은호로", "리비안", "리암", "리프선장", "릴리", "릴크스", "마그누스", "마그다", "마리엘", "마우", "마이카", "말리크", "말비라", "메리엘", "모레이나", "모르", "모리건", "모리던", "미나", "미덴", "바로드라쿠스", "바론", "바르가스", "바알세불", "바예크", "바크라", "반헬싱", "발레리아", "발레리야", "베노마", "베라", "베르나", "베신라", "베아트릭스", "벨리스", "볼카", "볼타스", "브레이니", "브로켈", "브루노", "브루트", "블라도프", "블라드3세", "비올레타베인", "사가스", "사스니", "사트라무", "사티", "살라잘", "상크", "샤미르", "세라스", "세레피나", "세르게이", "세브로스", "세크론", "셀레네", "셀레니", "셀카스", "소레일", "소르제스", "소설백", "손오공", "솔라리스", "솔카덴스", "스코치", "시슬라", "썬더", "아나이", "아노라", "아라샤", "아레스", "아르테미스", "아비스", "아스트레이", "아에리스", "아우렐리우스", "아인", "아자크스", "아젤", "아키라", "아테로크스", "아토스", "악마군주피니아스", "알다이야", "알더스", "알렉산드라부인", "알로트", "어둠의 에지오", "어둠의총사데인", "에드린", "에디스", "에르드", "에릴시아", "에블린", "에사레스", "에스미", "에이보르", "에일리스", "에일린", "에젠", "에지오 아디토레", "에프사", "엘", "엘로라", "엘로윈", "엘마", "여포", "오드무", "오라그", "오렌", "오리스테", "오림", "오만", "오스렌", "와엘", "와엘드론", "우레딘", "우르카스", "워로스", "유노미아", "유리", "이니트", "이랑신", "이미레잇", "이보엘", "이비 프라이", "이스트리드", "이안", "이오나", "이졸데", "일라샤", "잉그리드", "자리스", "제누스", "제로스", "제리엘", "젠나", "젠카이어", "젤라", "조지", "증오", "지제벨", "지젤", "초선", "카니샤", "카드그림", "카로사", "카리넬", "카리스타", "카메트", "카미엘", "카산드라", "카시르", "카에드", "카이난", "카헬리안", "칼립소", "커터", "케인", "켄", "코모도", "코원", "콘스탄스", "크레시", "크로돌", "크로우장군", "클라리사", "클리아", "키기리", "키로스", "킹 할츠", "타롤라", "타린", "타즈라", "탈렌", "탐욕", "톨레도", "트룩스", "트윈즈", "트윌라", "티투스", "파로스", "페르네", "페르샤", "페르시", "페이린", "펜리스", "펠라기우스", "포레스", "포셸", "플레트스", "피에르", "필리파", "하르벤", "하츠트", "할로우", "해골그림자회색수염", "헥스", "헬가"];
function heroOrderKey(name) { return String(name || "").replace(/\s+/g, ""); }
const heroUpdateRank = new Map(HERO_UPDATE_ORDER.map((name, i) => [heroOrderKey(name), i]));
const heroPreviousRank = new Map(HERO_PREVIOUS_ORDER.map((name, i) => [heroOrderKey(name), i]));
function compareHeroUpdateOrder(a, b) {
  const ak = heroOrderKey(a.nameKr), bk = heroOrderKey(b.nameKr);
  const ar = heroUpdateRank.get(ak) ?? Number.MAX_SAFE_INTEGER;
  const br = heroUpdateRank.get(bk) ?? Number.MAX_SAFE_INTEGER;
  return ar - br || (heroPreviousRank.get(ak) ?? Number.MAX_SAFE_INTEGER) - (heroPreviousRank.get(bk) ?? Number.MAX_SAFE_INTEGER);
}

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
const artifactProgressNote = document.querySelector("#artifactProgressNote");
const factionSelectShell = document.querySelector("#factionSelectShell");
const factionSelectButton = document.querySelector("#factionSelectButton");
const factionSelectMenu = document.querySelector("#factionSelectMenu");
const factionSelectKr = document.querySelector("#factionSelectKr");
const factionSelectEn = document.querySelector("#factionSelectEn");
const factionSelectCount = document.querySelector("#factionSelectCount");
const factionSelectEmblem = document.querySelector("#factionSelectEmblem");
const factionOptions = document.querySelectorAll(".faction-option[data-faction]");
const recentUpdateList = document.querySelector("#recentUpdateList");

let heroes = [];
let currentFaction = "all";
const active = { rarity: "all", class: "all", content: "all", collection: "all" };

const contentMeta = {
  abyss: { kr: "심연", en: "Abyss" },
  "arena-air": { kr: "아레나공중", en: "Arena Air" },
  "arena-aoe": { kr: "아레나광역", en: "Arena AoE" },
  "arena-single": { kr: "아레나단일", en: "Arena Single Target" }
};

const COLLECTION_VALUE_META = {
  "5.0": { label: "최우선급", icon: "crown" },
  "4.0": { label: "높은 가치", icon: "medal" },
  "3.0": { label: "보통", icon: "crest" },
  "2.0": { label: "낮은 편", icon: "shield-dim" },
  "1.0": { label: "수집 우선도 낮음", icon: "empty" }
};

function normalizeCollectionValue(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) return null;
  if (numeric < 1 || numeric > 5) return null;
  return numeric;
}

function getCollectionValueMeta(value) {
  const score = normalizeCollectionValue(value);
  if (score === null) return null;
  const key = score.toFixed(1);
  const meta = COLLECTION_VALUE_META[key];
  return meta ? { ...meta, score, key, className: `cv-${Math.round(score * 10)}` } : null;
}

function collectionIconSvg(icon) {
  const icons = {
    crown: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 7.4 11 12 5l4.6 6L20 7.5l-1.7 10.2H5.7L4 7.5Z"/><path d="M7 20h10"/></svg>`,
    gem: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l4 5-9 11L3 9l4-5Z"/><path d="M3 9h18M7 4l5 16 5-16"/></svg>`,
    medal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3 4 6 4-6"/><circle cx="12" cy="14.5" r="5.5"/><path d="m12 11.4 1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3 1-2Z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5.2c0 4.5-2.7 7.7-7 9.8-4.3-2.1-7-5.3-7-9.8V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    crest: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><circle cx="12" cy="12" r="2.2"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z"/><circle cx="12" cy="12" r="1"/></svg>`,
    "shield-dim": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.3-2.6 7.5-7 9.6C7.6 18.5 5 15.3 5 11V6l7-3Z"/><path d="M8.5 12h7"/></svg>`,
    cracked: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><path d="m13 5-2.1 5 2.2 2-3.1 6"/></svg>`,
    empty: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>`
  };
  return icons[icon] || icons.crest;
}


function getExclusiveArtifactStats(heroList) {
  const getArtifact = (hero) => hero.recommendedArtifact || hero.exclusiveArtifact || null;
  const entries = heroList.filter((hero) => {
    const artifact = getArtifact(hero);
    return Boolean(artifact && (artifact.nameKr || artifact.nameEn));
  });

  const complete = entries.filter((hero) => {
    const artifact = getArtifact(hero);
    return artifact?.nameKr && artifact?.nameEn;
  }).length;
  const krOnly = entries.filter((hero) => {
    const artifact = getArtifact(hero);
    return artifact?.nameKr && !artifact?.nameEn;
  }).length;
  const enOnly = entries.filter((hero) => {
    const artifact = getArtifact(hero);
    return !artifact?.nameKr && artifact?.nameEn;
  }).length;

  return { total: entries.length, complete, krOnly, enOnly };
}

function updateArtifactProgressNote() {
  if (!artifactProgressNote) return;
  const stats = getExclusiveArtifactStats(heroes);
  artifactProgressNote.textContent =
    `추천 아티팩트 등록 영웅 ${stats.total}명 · 한·영 이름 완전 매칭 ${stats.complete}명 · 한국명만 확인 ${stats.krOnly}명 · 영문명만 확인 ${stats.enOnly}명`;
}

function matchesContent(hero) {
  return (
    active.content === "all" ||
    (hero.contentTags || []).includes(active.content)
  );
}

function getCollectionBucket(value) {
  return normalizeCollectionValue(value);
}

function matchesCollectionValue(hero) {
  if (active.collection === "all") return true;
  const bucket = getCollectionBucket(hero.collectionValue);
  return bucket !== null && String(bucket) === active.collection;
}

function getContentTagMarkup(hero) {
  return (hero.contentTags || [])
    .map((tag) => {
      const meta = contentMeta[tag];
      return meta
        ? `<span class="content-tag ${tag}" title="${meta.en} 추천 영웅">${meta.kr}</span>`
        : "";
    })
    .join("");
}

const factionMeta = {
  "all": {
    kr: "전체 영웅",
    en: "All Heroes",
    total: 0
  },
  "watch-guard": {
    kr: "파수꾼 소대",
    en: "Watch Guard",
    total: 0
  },
  "north-throne": {
    kr: "북쪽 경계 왕좌",
    en: "North Throne",
    total: 0
  },
  "nightmare-council": {
    kr: "악몽 의회",
    en: "Nightmare Council",
    total: 0
  },
  "cursed-cult": {
    kr: "저주신교",
    en: "Cursed Cult",
    total: 0
  },
  "infernal-blast": {
    kr: "연옥 폭파",
    en: "Infernal Blast",
    total: 0
  },
  "star-piercers": {
    kr: "관성의 화살",
    en: "Star Piercers",
    total: 0
  },
  "esoteria-order": {
    kr: "비법회",
    en: "Esoteria Order",
    total: 0
  },
  "chaos-dominion": {
    kr: "혼돈 정복자",
    en: "Chaos Dominion",
    total: 0
  },
  "supreme-arbiters": {
    kr: "최고 중재자",
    en: "Supreme Arbiters",
    total: 0
  },
  "unnamable": {
    kr: "알 수 없는 자",
    en: "Unnamable",
    total: 0
  }
};

function buildFactionTotals(data) {
  const totals = { all: data.length };

  data.forEach((hero) => {
    (hero.memberships || []).forEach((membership) => {
      if (!membership.faction) return;
      totals[membership.faction] = (totals[membership.faction] || 0) + 1;
    });
  });

  return totals;
}

function syncFactionTotalsFromHeroes() {
  const totals = buildFactionTotals(heroes);

  Object.entries(factionMeta).forEach(([factionId, meta]) => {
    meta.total = totals[factionId] || 0;
  });

  factionOptions.forEach((option) => {
    const countNode = option.querySelector(".faction-option-count");
    if (!countNode) return;

    const total = factionMeta[option.dataset.faction]?.total ?? 0;
    countNode.textContent = `${total}명`;
  });
}

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

function getCollectionValueMarkup(hero) {
  const meta = getCollectionValueMeta(hero.collectionValue);
  if (!meta) return "";

  const scoreText = meta.score.toFixed(1);
  const title = `수집가치 ${scoreText} / 5.0 · ${meta.label}`;

  return `
    <div class="collection-value-badge ${meta.className}" title="${title}" aria-label="${title}">
      <span class="collection-value-icon">${collectionIconSvg(meta.icon)}</span>
      <span class="collection-value-mini-label">수집</span>
      <strong>${scoreText}</strong>
    </div>
  `;
}

function card(hero, membership, searchMode = false) {
  const initial = (hero.nameEn || hero.nameKr).trim().charAt(0).toUpperCase();
  const memberships = hero.memberships || [];
  const isMultiFaction = memberships.length > 1;
  const factionNames = getFactionNames(hero);
  const showLord = searchMode
    ? memberships.some((item) => item.lord)
    : Boolean(membership?.lord);
  const contentTags = getContentTagMarkup(hero);

  return `
    <a class="hero-card-link" href="/hero/${hero.id}/" aria-label="${hero.nameKr} (${hero.nameEn}) 상세 보기">
    <article class="hero-card">
      <div class="card-visual">
        ${membership?.portrait
          ? `<img src="${membership.portrait}" alt="${hero.nameKr} (${hero.nameEn}) 영웅 카드" loading="lazy">`
          : `<span>${initial}</span>`}
        ${getCollectionValueMarkup(hero)}
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
        ${contentTags ? `<div class="content-tags">${contentTags}</div>` : ""}
      </div>
    </article>
    </a>
  `;
}

function setAllFilters() {
  active.rarity = "all";
  active.class = "all";
  active.content = "all";
  active.collection = "all";

  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.value === "all");
  });
}

function updateFactionSelectState(searchMode = false) {
  const meta = factionMeta[currentFaction];
  const selectedOption = Array.from(factionOptions).find(
    (option) => option.dataset.faction === currentFaction
  );
  const resolvedTotal =
    currentFaction === "all" ? heroes.length : meta.total;

  if (factionSelectKr) factionSelectKr.textContent = meta.kr;
  if (factionSelectEn) factionSelectEn.textContent = meta.en;
  if (factionSelectCount) {
    const shouldShowCount = searchMode || currentFaction !== "all";
    factionSelectCount.hidden = !shouldShowCount;
    factionSelectCount.textContent = searchMode
      ? "전 진영 검색 중"
      : `${resolvedTotal}명`;
  }
  if (factionSelectEmblem && selectedOption) {
    factionSelectEmblem.textContent = selectedOption.dataset.emblem || "◎";
  }

  const allCount = document.querySelector("#allHeroesOptionCount");
  if (allCount) allCount.textContent = `${heroes.length}명`;

  factionOptions.forEach((option) => {
    const isSelected = option.dataset.faction === currentFaction;
    option.classList.toggle("selected", isSelected);
    option.setAttribute("aria-selected", isSelected ? "true" : "false");
  });

  if (factionSelectButton) {
    factionSelectButton.classList.toggle("search-mode", searchMode);
  }
}

function closeFactionSelect() {
  if (!factionSelectMenu || !factionSelectButton) return;
  factionSelectMenu.hidden = true;
  factionSelectButton.setAttribute("aria-expanded", "false");
  factionSelectShell?.classList.remove("open");
}

function openFactionSelect() {
  if (!factionSelectMenu || !factionSelectButton) return;
  factionSelectMenu.hidden = false;
  factionSelectButton.setAttribute("aria-expanded", "true");
  factionSelectShell?.classList.add("open");
}

function toggleFactionSelect() {
  if (!factionSelectMenu) return;
  if (factionSelectMenu.hidden) openFactionSelect();
  else closeFactionSelect();
}

function updateFactionHeader(meta) {
  if (rosterKicker) rosterKicker.textContent = "FACTION HEROES";
  if (rosterTitle) rosterTitle.textContent = meta.kr;
  if (totalCount) totalCount.textContent = meta.total;
  if (resultSummary) resultSummary.textContent = "선택한 진영의 영웅 목록입니다.";

  if (dataNote) {
    dataNote.textContent =
      `${meta.kr} ${meta.total}명 등록 완료 · 이중 진영 영웅도 각 진영에서 정상 표시됩니다.`;
  }
}

function updateAllHeroesHeader(resultCount) {
  if (rosterKicker) rosterKicker.textContent = "HERO INDEX";
  if (rosterTitle) rosterTitle.textContent = "영웅 목록";
  if (totalCount) totalCount.textContent = heroes.length;

  if (resultSummary) {
    if (active.rarity !== "all" || active.class !== "all" || active.content !== "all" || active.collection !== "all") {
      resultSummary.textContent = `필터 적용 · ${resultCount}명 표시`;
    } else {
      resultSummary.textContent = "필터로 원하는 영웅을 빠르게 찾아보세요.";
    }
  }

  if (dataNote) {
    dataNote.textContent =
      "전체 영웅 모드 · 이중 진영 영웅은 한 번만 표시되고 모든 소속 진영을 함께 보여줍니다.";
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

  updateFactionSelectState(isSearchMode);

  if (isSearchMode) {
    const filtered = heroes
      .filter((hero) =>
        matchesSearch(hero, query) &&
        (active.rarity === "all" || hero.rarity === active.rarity) &&
        (active.class === "all" || hero.class === active.class) &&
        matchesContent(hero) &&
        matchesCollectionValue(hero)
      )
      .sort(compareHeroUpdateOrder);

    updateSearchHeader(query, filtered.length);

    heroGrid.innerHTML = filtered
      .map((hero) => card(hero, getPrimaryMembership(hero), true))
      .join("");

    emptyState.hidden = filtered.length !== 0;
    visibleCount.textContent = filtered.length;
    return;
  }

  if (currentFaction === "all") {
    const filtered = heroes
      .filter((hero) =>
        (active.rarity === "all" || hero.rarity === active.rarity) &&
        (active.class === "all" || hero.class === active.class) &&
        matchesContent(hero) &&
        matchesCollectionValue(hero)
      )
      .sort(compareHeroUpdateOrder);

    updateAllHeroesHeader(filtered.length);

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
      (active.class === "all" || hero.class === active.class) &&
      matchesContent(hero) &&
      matchesCollectionValue(hero)
    )
    .sort((a, b) => compareHeroUpdateOrder(a.hero, b.hero));

  updateFactionHeader(meta);

  heroGrid.innerHTML = filtered
    .map(({ hero, membership }) => card(hero, membership, false))
    .join("");

  emptyState.hidden = filtered.length !== 0;
  visibleCount.textContent = filtered.length;

  if (active.rarity !== "all" || active.class !== "all" || active.content !== "all" || active.collection !== "all") {
    resultSummary.textContent = `필터 적용 · ${filtered.length}명 표시`;
  } else {
    resultSummary.textContent = "선택한 진영의 영웅 목록입니다.";
  }
}


function renderRecentUpdates(items) {
  if (!recentUpdateList || !Array.isArray(items) || !items.length) return;
  const fragment = document.createDocumentFragment();
  items.slice(0, 3).forEach((item) => {
    if (!item || !item.heroId || !item.heroName || !item.message) return;
    const link = document.createElement("a");
    link.className = "recent-fix-item";
    link.href = `/hero/${encodeURIComponent(item.heroId)}/${item.kind === "review" ? "#hero-comments" : ""}`;

    const kind = document.createElement("span");
    kind.className = `recent-fix-kind ${item.kind === "review" ? "review" : "info"}`;
    kind.textContent = item.kind === "review" ? "후기" : "정보";

    const hero = document.createElement("strong");
    hero.textContent = item.heroName;

    const message = document.createElement("span");
    message.className = "recent-fix-message-text";
    message.textContent = item.message;

    const timestamp = Number(item.timestamp);
    const date = document.createElement("time");
    date.className = "recent-fix-date";
    if (Number.isFinite(timestamp)) {
      const value = new Date(timestamp * 1000);
      const parts = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit" }).formatToParts(value);
      const month = parts.find((part) => part.type === "month")?.value || "";
      const day = parts.find((part) => part.type === "day")?.value || "";
      date.textContent = month && day ? `${month}.${day}` : "";
      date.dateTime = value.toISOString();
    }

    link.append(kind, hero, message);
    if (date.textContent) link.append(date);
    fragment.append(link);
  });
  if (fragment.childNodes.length) recentUpdateList.replaceChildren(fragment);
}

fetch("/api/recent-updates?v=2.13.4g", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("recent updates load failed");
    return response.json();
  })
  .then((data) => renderRecentUpdates(data.updates))
  .catch((error) => console.warn(error));

fetch("./heroes.json?v=2.13.4")
  .then((response) => {
    if (!response.ok) throw new Error("heroes.json load failed");
    return response.json();
  })
  .then((data) => {
    heroes = data;
    syncFactionTotalsFromHeroes();
    updateArtifactProgressNote();
    render();
  })
  .catch((error) => {
    console.error(error);
    resultSummary.textContent = "영웅 데이터를 불러오지 못했습니다.";
  });

function syncSearchClearButton() {
  if (!clearSearch) return;
  clearSearch.hidden = !searchInput.value.trim();
}

syncSearchClearButton();

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  syncSearchClearButton();

  // 이름 검색은 전 진영 통합 검색 모드.
  // 검색을 시작하는 순간 기존 희귀도/직업/콘텐츠/수집가치 필터를 전체로 초기화한다.
  if (query) {
    setAllFilters();
  }

  render();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  syncSearchClearButton();
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

if (factionSelectButton) {
  factionSelectButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFactionSelect();
  });
}

factionOptions.forEach((option) => {
  option.addEventListener("click", () => {
    currentFaction = option.dataset.faction;

    // 진영 선택 시 검색/필터를 초기화하고 선택한 진영의 도감으로 전환한다.
    searchInput.value = "";
    setAllFilters();
    closeFactionSelect();
    render();

    // 선택 후 영웅 목록 시작부가 자연스럽게 이어지도록 너무 과한 스크롤은 하지 않는다.
    document.querySelector(".roster")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

document.addEventListener("click", (event) => {
  if (
    factionSelectShell &&
    !factionSelectShell.contains(event.target)
  ) {
    closeFactionSelect();
  }
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
    <p>홈 화면에 <strong>나만겜 영웅 위키</strong> 아이콘을 추가하고 앱처럼 바로 실행할 수 있습니다.</p>
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
  if (event.key === "Escape") {
    closeFactionSelect();

    if (installModal && !installModal.hidden) {
      closeInstallModal();
    }
  }
});

// Back to top
const backToTopButton = document.querySelector("#backToTopButton");

if (backToTopButton) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncBackToTopVisibility = () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", syncBackToTopVisibility, { passive: true });
  syncBackToTopVisibility();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
}

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
