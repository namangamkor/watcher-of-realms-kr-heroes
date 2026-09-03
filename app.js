const heroGrid = document.querySelector("#heroGrid");
const searchInput = document.querySelector("#searchInput");
const clearButton = document.querySelector("#clearButton");
const emptyState = document.querySelector("#emptyState");
const resultText = document.querySelector("#resultText");
const heroCount = document.querySelector("#heroCount");

let heroes = [];

const normalize = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .trim();

function matchesHero(hero, query) {
  if (!query) return true;

  const haystack = [
    hero.nameKr,
    hero.nameEn,
    ...(hero.aliases || []),
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(normalize(query));
}

function heroCard(hero) {
  const aliases = hero.aliases?.length
    ? `별칭: ${hero.aliases.join(" · ")}`
    : "등록된 별칭 없음";

  const initial = (hero.nameEn || hero.nameKr || "?").trim().charAt(0).toUpperCase();

  return `
    <article class="hero-card">
      <div class="initial">${initial}</div>
      <h3>${hero.nameKr}</h3>
      <p class="english-name">${hero.nameEn}</p>
      <p class="aliases">${aliases}</p>
    </article>
  `;
}

function render() {
  const query = searchInput.value;
  const filtered = heroes.filter((hero) => matchesHero(hero, query));

  heroGrid.innerHTML = filtered.map(heroCard).join("");
  emptyState.hidden = filtered.length !== 0;

  if (query.trim()) {
    resultText.textContent = `"${query}" 검색 결과 ${filtered.length}명`;
  } else {
    resultText.textContent = "전체 영웅을 표시하고 있습니다.";
  }
}

fetch("./heroes.json")
  .then((response) => {
    if (!response.ok) throw new Error("영웅 데이터를 불러오지 못했습니다.");
    return response.json();
  })
  .then((data) => {
    heroes = data;
    heroCount.textContent = `${heroes.length}명의 영웅`;
    render();
  })
  .catch((error) => {
    console.error(error);
    resultText.textContent = "영웅 데이터를 불러오는 중 오류가 발생했습니다.";
  });

searchInput.addEventListener("input", render);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  render();
});
