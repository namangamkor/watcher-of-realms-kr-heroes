# v2.14.70 · 오켄바르 WebP 이미지 교체

- 현재 패치 버전: v2.14.70
- 기준 버전: v2.14.69 `worwiki-v2.14.69-rosalia-webp.zip` 적용 상태
- 주요 변경사항: 사용자 제공 오켄바르 600×844 WebP(57,844 bytes)를 `watch-guard-hq-41-oakenvar-v21470.webp`로 추가. `_worker.js`의 초기 카드와 내장 영웅 데이터, `heroes.json`의 초상화 경로를 동일하게 교체. `app.js`의 영웅 데이터 및 업데이트 API 요청 버전과 Worker의 앱 스크립트 버전을 v2.14.70으로 갱신. 다른 영웅 데이터·정렬 로직은 유지.
- 배포/적용 여부: 패치 ZIP 제작 완료. GitHub 및 Cloudflare 사이트 미적용.
- 적용 방법: v2.14.69 적용 사이트의 루트에 ZIP 안의 `_worker.js`, `app.js`, `heroes.json`, `watch-guard-hq-41-oakenvar-v21470.webp` 네 파일을 함께 올리세요. 앞서 업로드한 베이라시아·로살리아 WebP는 유지해야 합니다.
- 삭제 후보: `watch-guard-hq-41-oakenvar-v21460.png`는 이 패치의 세 파일에서 더 이상 참조하지 않습니다. 저장소의 다른 참조가 없는지 확인한 뒤 삭제하세요. ZIP은 물리적 삭제를 수행하지 않습니다.
