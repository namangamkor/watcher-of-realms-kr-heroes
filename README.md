# v2.14.141 장비 프리셋 검색 정보 보강

- 작업일: 2026-10-16 Asia/Seoul
- 기준 버전: v2.14.140 (승인 v3 카드 디자인)
- 적용 상태: 패치 제작 완료 / 운영 사이트 미배포

## 변경
- 검색용 제목: 워처오브렐름 장비 프리셋·공유 코드 | 나만겜 위키
- 대제목: 워처오브렐름 장비 프리셋
- meta description 및 화면 소개에 게임명, 공유 코드, 성장용 V4.0과 END V1.0 명시
- 화면 버전 v2.14.141
- gear-presets.html과 _worker.js의 WW_PRESET_HUB_HTML 동기화
- 승인 카드 CSS, 이미지, 이동 경로, 날짜, 주의사항 보존
- app.js·heroes.json은 v2.14.140과 바이트 동일. 한 세트로 동봉

## 적용
ZIP 내 8개 파일을 기존 저장소 루트에 덮어쓰기. 전체 사이트 백업이 아닌 패치입니다. 기존 나머지 파일은 유지하세요. 고유 파일명 WebP 2개도 포함되어 있어 v2.14.140 이미지 경로를 유지합니다.

## 확인된 색인 상태 및 다음 단계
2026-10-16 Google URL Inspection API에서 https://worwiki.kr/gear-presets 는 'URL is unknown to Google', lastCrawlTime null로 확인되었습니다. 차단 여부는 이 결과로 확정할 수 없습니다.
배포 후 Search Console에서 아래 URL을 검사하고 '실제 URL 테스트' 후 '색인 생성 요청'을 실행하세요.
https://worwiki.kr/gear-presets
이 패치는 색인 요청을 자동 전송하지 않습니다. 색인 및 순위 상승은 보장하지 않습니다.

## 검증
JavaScript 구문 검사, 정적 HTML과 내장 HTML 동일성 확인. Worker의 해당 HTML 상수 외 모든 코드 동일성, app.js·heroes.json·이미지 바이트 동일성 확인. 브라우저 시각 검증은 실행 환경 제약으로 미완료. 기존 반응형 CSS 및 제목 줄바꿈 처리를 유지했습니다.
