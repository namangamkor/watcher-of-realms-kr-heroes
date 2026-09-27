# v2.14.72 · 발레리아(Valara) 이미지 교체 및 발레리야(Valeriya) 복구

- 현재 패치 버전: v2.14.72
- 기준 버전: v2.14.70. 잘못 만든 v2.14.71을 적용한 경우에도 이 ZIP의 세 코드·데이터 파일을 모두 덮어써 복구합니다.
- 주요 변경사항: 사용자 제공 600×839 WebP를 발레리아(`valara`)의 에소테리아·최고 중재자 두 진영 초상화에만 `valara-dual-faction-v21472.webp`로 연결합니다. v2.14.71에서 잘못 변경된 별개 영웅 발레리야(`valeriya`)의 악몽 의회·혼돈 정복자 경로를 원래대로 돌립니다. `_worker.js` 초기 카드·내장 데이터, `heroes.json`을 동기화하고 `app.js`와 Worker의 로딩 버전을 올립니다. 그 외 데이터·정렬 로직은 변경하지 않습니다.
- 배포/적용 여부: ZIP 제작 완료. GitHub 및 Cloudflare 사이트에는 아직 미적용.
- 적용 방법: v2.14.70 또는 v2.14.71 위에 ZIP의 `_worker.js`, `app.js`, `heroes.json`, `valara-dual-faction-v21472.webp`와 발레리야 원본 이미지 2개를 사이트 루트에 함께 덮어쓰세요. 발레리야 원본 2개는 v2.12.4 전체 백업에서 복원해 ZIP에 포함했습니다.
- 삭제 후보: v2.14.71 오류 파일 `valeriya-dual-faction-v21471.webp`와 발레리아의 이전 파일 `esoteria-hq-16-valara.webp`, `supreme-arbiters-hq-08-valara.webp`는 이 패치의 세 파일에서는 참조하지 않습니다. 전체 저장소의 다른 참조를 확인한 뒤 삭제하세요. 발레리야 기존 두 이미지는 삭제하면 안 됩니다.
