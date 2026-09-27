# v2.14.71 · 발레리야 이미지 교체

- 현재 패치 버전: v2.14.71
- 기준 버전: v2.14.70 `worwiki-v2.14.70-oakenvar-webp.zip` 적용 상태
- 주요 변경사항: 사용자가 제공한 600×839 WebP(81,140 bytes)를 `valeriya-dual-faction-v21471.webp`로 새로 추가. 악몽 의회·혼돈 정복자 두 소속의 초상화 경로를 동일하게 변경. `_worker.js`의 초기 카드 및 내장 영웅 데이터, `heroes.json`의 두 진영 초상화 경로를 점검했고 `app.js`와 Worker의 요청 버전을 v2.14.71로 갱신. 그 밖의 영웅 데이터와 정렬 로직은 유지. 기존 사이트의 영웅명 표기는 이 패치에서 변경하지 않았습니다.
- 배포/적용 여부: 패치 ZIP 제작 완료. GitHub 및 Cloudflare 사이트 미적용.
- 적용 방법: v2.14.70 적용 상태에서 ZIP의 `_worker.js`, `app.js`, `heroes.json`, `valeriya-dual-faction-v21471.webp`를 사이트 루트에 함께 업로드. 이전 패치의 베이라시아·로살리아·오켄바르 WebP 파일은 유지하세요.
- 삭제 후보: `nightmare-council-hq-12-valeriya.webp`와 `chaos-dominion-hq-07-valeriya.webp`는 이 패치의 세 파일에서는 더 이상 참조하지 않습니다. 전체 저장소의 다른 참조가 없는지 확인한 뒤 삭제하세요. ZIP이 실제 파일 삭제를 수행하지는 않습니다.
