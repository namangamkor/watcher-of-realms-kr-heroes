# v2.14.68 · 베이라시아 300px WebP 교체

- 현재 패치 버전: v2.14.68
- 기준 버전: v2.14.67 `worwiki-v2.14.67-decimus-user-image.zip`
- 주요 변경사항: 사용자 제공 베이라시아 300×422 WebP를 새 경로 `nightmare-council-hq-40-beirasia-v21468.webp`로 추가. `_worker.js`의 초기 카드 이미지와 내장 영웅 데이터, `heroes.json`의 초상화 경로를 동일하게 교체. `app.js`의 영웅 데이터/업데이트 API 요청 버전과 Worker의 앱 스크립트 요청 버전을 v2.14.68로 갱신. 베이라시아 외 영웅 데이터와 정렬 로직은 유지.
- 배포/적용 여부: 패치 ZIP 제작 완료. GitHub 및 Cloudflare 사이트에는 아직 미적용.
- 적용 방법: ZIP 안의 `_worker.js`, `app.js`, `heroes.json`, `nightmare-council-hq-40-beirasia-v21468.webp`를 사이트 루트에 함께 올리세요. v2.14.67을 기준으로 덮어씁니다.
- 삭제 후보: `nightmare-council-hq-40-beirasia-v21458.png`는 이 패치의 세 파일에서 더 이상 참조하지 않습니다. 실제 저장소에서 다른 참조가 없는지 확인한 뒤 삭제하세요. 이 ZIP은 물리적 삭제를 수행하지 않습니다.
