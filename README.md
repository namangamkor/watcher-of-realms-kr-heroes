# worwiki v2.14.51 — 통합 재작업판

## 베이스
- 문법 정상 확인된 v2.14.45에서 다시 제작
- v2.14.46~2.14.50 누적 임시패치 미사용

## 통합 수정
- 오켄바르: 다시 제공된 이미지로 1600×900 목록용 WebP 재제작
- 로살리아: 가장 최근 제공 이미지로 1600×900 목록용 WebP 재제작
- 베이라시아: 정상 확인된 1600×900 이미지 유지
- 잘못된 `contain` 썸네일 규칙 제거, 목록 이미지는 `cover` 사용
- `WW_HERO_EDITORIAL_UPDATES` 단일 데이터원 생성
- 최근 업데이트 피드와 전체 목록 우선정렬이 같은 업데이트 데이터를 사용
- 신규 영웅 표기: `신규영웅등록`
- 이미지 변경 표기: `이미지업데이트`
- 현재 우선순위: 로살리아 → 오켄바르 → 베이라시아
- 세 이미지 URL에 `?v=2.14.51` 캐시 버스터 적용

## 파일
- `_worker.js`
- `cursed-cult-hq-30-rosalia.webp`
- `watch-guard-hq-41-oakenvar.webp`
- `nightmare-council-hq-40-beirasia.webp`
- `README.md`
- `VERSION.txt`
