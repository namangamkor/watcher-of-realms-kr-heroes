# worwiki v2.14.125 최종 장비 추천 교정

기준: v2.14.123. 상태: 패치 제작 완료, 사이트 배포 미실행.

## 변경
- 두르가: 질풍 + 마력 → 전쟁의 주인 + 성스러운 날개.
- 우르카스: 전쟁의 주인 + 마력 → 전쟁의 주인 + 재앙 드래곤 (사용자 지정).
- 레이저: 질풍 + 성스러운 날개 → 전쟁의 주인 + 성스러운 날개 (사용자 지정).
- 데시무스: 미등록 → 악의 복수 + 재앙 드래곤 (사용자 지정).
- 레이븐홀드: 전쟁의 주인 + 성스러운 날개 → 혈염드래곤혈통 + 성스러운 날개.

## 확인 자료
- https://fastidious.gg/heroes/durza
- https://prospector.gg/hero/durza/
- https://fastidious.gg/heroes/rivenhald

두르가는 Fastidious Gear Recommendations에서 Drakefire를 1순위로 표시하지만 상세 Stage 3와 Prospector 현재 빌드는 Warlord를 사용한다. 공통 확인되는 Warlord + Wings of Grace를 적용하며, 절대적인 최적 조합으로 입증됐다고 표현하지 않는다.
레이븐홀드는 Fastidious의 현재 추천 1순위와 상세 Stage 3 모두 Drakefire + Wings of Grace다. Warlord는 2순위다.
우르카스·데시무스는 사용자 지정 조합이며 외부 검증을 수행했다고 기록하지 않았다.

## 파일과 적용
heroes.json, _worker.js를 v2.14.123 기준 사이트 루트에 덮어쓴다.
app.js는 v2.14.122 기준 파일을 검토했으며 관련 영웅 추천 데이터 중복이 없어 변경·동봉하지 않았다.
README.md와 VERSION.txt는 작업 기록이다.

## 검증
영웅 수 260 유지. 지정 5명 외 변경 없음. Worker HEROES와 JSON 전체 일치. Worker 문법과 상세페이지 렌더링 검증.
END 프리셋 20개는 변경하지 않았다.

## 아이콘 수정
혈염드래곤혈통의 장비명 정규화 키와 실제 이미지 파일을 추가했다.
이미지 원본: https://fastidious.gg/storage/sets/87mz4L0o7DlwYlyvSXUcVB2ORl233DOFF4kbaRij.webp
gear-icon-drakefire-v214125.webp를 반드시 사이트 루트에 함께 업로드한다.
v2.14.124의 5명 교정을 포함하므로 v2.14.123 또는 v2.14.124 위에 적용할 수 있다.
app.js는 별도 아이콘 매핑이 없어 변경하지 않았다.
