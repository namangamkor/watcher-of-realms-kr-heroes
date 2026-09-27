# v2.14.69 · 로살리아 WebP 이미지 교체

- 현재 패치 버전: v2.14.69
- 기준 버전: v2.14.68 `worwiki-v2.14.68-beirasia-300-webp.zip`
- 주요 변경사항: 사용자 제공 로살리아 600×872 WebP(51,020 bytes)를 `cursed-cult-hq-30-rosalia-v21469.webp`로 추가. `_worker.js`의 초기 카드 및 내장 영웅 데이터, `heroes.json`의 로살리아 경로를 동일하게 교체. `app.js`의 영웅 데이터 및 업데이트 API 요청 버전과 Worker의 앱 스크립트 버전을 v2.14.69로 갱신. 다른 영웅 데이터·정렬 로직은 유지.
- 배포/적용 여부: 패치 ZIP 제작 완료. GitHub 및 Cloudflare 사이트에는 미적용.
- 적용 방법: v2.14.68의 전체 파일이 먼저 적용된 사이트를 기준으로, ZIP의 `_worker.js`, `app.js`, `heroes.json`, `cursed-cult-hq-30-rosalia-v21469.webp`를 사이트 루트에 함께 올리세요. v2.14.68의 베이라시아 WebP 파일도 유지해야 합니다.
- 삭제 후보: `cursed-cult-hq-30-rosalia-v21457.png`는 이 패치의 세 파일에서 더 이상 참조하지 않습니다. 실제 저장소에 남은 다른 참조가 없는지 확인한 뒤 삭제하세요. ZIP은 물리적 삭제를 수행하지 않습니다.
