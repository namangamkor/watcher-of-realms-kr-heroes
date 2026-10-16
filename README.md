# 장비 프리셋 선택 화면 v2.14.140

- 작업일: 2026-10-16 (Asia/Seoul)
- 기준: worwiki-v2.14.139-home-tool-buttons-patch.zip
- 상태: 통합 완료 / 미배포 / 브라우저 시각 검증 대기
- 운영 소스 직접 비교: worwiki.kr 접근이 HTTP 403으로 차단되어 최신 보관 패치를 기준으로 작업.

## 변경
승인된 gear-presets-design-preview-v3.html의 카드, 그라데이션, 반응형 CSS와 내장된 승인 이미지를 그대로 사용합니다. 성장용 에픽 3인과 END 북부 전사 2인 이미지입니다. 새 디자인 및 애니메이션은 추가하지 않았습니다.
이미지는 시안 내 WebP 원본 바이트를 그대로 추출하여 불필요한 재압축을 피했습니다. 고유 버전 파일명으로 이미지 캐시를 구분합니다.
시안의 두 동일한 임시 링크를 운영 경로 /gear-presets-v4, /gear-presets-end로 연결했습니다. 시안 표시를 제거하고 화면 버전을 v2.14.140으로 갱신했습니다. 업데이트 날짜와 200판 실험 결과, 주의사항을 보존했습니다.

## 파일 및 적용
ZIP 내부 파일을 기존 저장소 루트에 같은 이름으로 덮어씁니다. 이미지 2개도 반드시 루트에 올립니다.
- gear-presets.html: 승인 v3 UI 통합
- _worker.js: WW_PRESET_HUB_HTML을 위 HTML과 동일하게 동기화. 그 외 운영 코드 보존.
- app.js, heroes.json: v2.14.139 기준 원본 그대로 동봉한 한 세트. 데이터 및 영웅 기능 변경 없음.
- preset-growth-v214140.webp, preset-end-v214140.webp: 승인 이미지
- README.md, VERSION.txt
기존 gear-presets-v4, gear-presets-end.html, end-preset-data.json 및 나머지 파일은 유지합니다. 이 ZIP은 전체 백업이 아닌 덮어쓰기 패치입니다. 기준 버전 이후 별도 수정이 있다면 그 파일에 병합한 뒤 적용하세요.

## 검증
- JavaScript 구문 검사 통과.
- Worker 실행: /gear-presets 200, 별칭 경로 301, 성장용/END 이동 경로 및 메인/아티팩트 경로 정상.
- /gear-presets를 제외한 검증 경로 응답은 기준과 동일.
- app.js, heroes.json 바이트 동일 확인.
- 이미지 디코딩 및 파일 참조 확인.
- PC/모바일 브라우저 시각 검증 미완료: Chromium 미설치 및 다운로드 실패. 시안의 PC/모바일 배치 CSS를 유지했으나 겹침·크롭을 실제 브라우저로 검증했다고 주장하지 않습니다.

## 배포 전 및 배포 후 확인
PC 1280px, 모바일 390px/360px에서 얼굴·무기·문구 크롭 및 가로 넘침을 확인하세요. 두 버튼으로 실제 프리셋 및 공유 코드에 접근되는지 확인하세요. /gear-presets와 /gear-presets.html의 리다이렉트 후 v2.14.140 표시, 두 WebP의 HTTP 200 로딩을 확인하세요. 시각 검증 및 운영 확인이 끝나기 전 완료 배포로 간주하지 않습니다.
