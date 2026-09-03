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

searchInput.addEventListener("input", render);

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
