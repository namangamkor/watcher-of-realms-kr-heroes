# worwiki.kr v2.14.80 — 이비 프라이 초상 교체

- 기준 버전: 사용자가 배포 완료를 확인한 v2.14.75. v2.14.76~v2.14.79는 배포 확인이 없으므로 해당 수정도 포함한 누적 패치.
- 배포 상태: 패치 ZIP 제작 및 로컬 검증 완료. GitHub/Cloudflare 미적용.
- 사용자가 제공한 600×872 WebP(약 67KB)를 `star-piercers-hq-46-evie-frye-v21480.webp`로 새로 등록했다. `heroes.json`의 이비 프라이 이미지 경로와 `_worker.js` 영웅 상세 데이터·첫 화면 카드, `index.html` 카드를 함께 연결했다.
- v2.14.79까지의 오켄바르 장비 옵션 수정, 두 영웅 임시 섹션 제거, 베이라시아 추천 장비, 영문명 Veyrathia 수정이 포함된다.
- `_worker.js`, `app.js`, `heroes.json`을 함께 대조하고 앱 요청 버전을 2.14.80으로 갱신했다.

## 적용

ZIP을 풀어 `_worker.js`, `app.js`, `heroes.json`, `index.html`, `star-piercers-hq-46-evie-frye-v21480.webp`, `README.md`, `VERSION.txt` 일곱 파일을 GitHub 저장소 루트에 업로드한다. ZIP 파일 자체를 올리지 않는다.

## 검증

v2.14.79 대비 영웅 데이터 변경은 이비 프라이의 이미지 경로 한 곳뿐. 새 파일과 사용자 원본의 SHA-256 일치, Worker/JSON 258명 데이터 정확히 일치, Worker/대체 첫 화면 카드의 새 이미지 경로 일치, 기존 이미지 경로 참조 0건, 생성 스크립트 동기화 및 JavaScript 문법 검사 통과.

## 삭제 후보

배포 후 이비 프라이 목록·상세에 새 이미지가 표시되는 것을 확인하면 저장소 루트의 `star-piercers-hq-46-evie-frye.webp`는 삭제 후보이다. 이번 패치에는 삭제를 포함하지 않았다. 새 `...-v21480.webp`는 삭제하지 않는다.
