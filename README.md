# v2.14.60 오켄바르 이미지 신규 경로

- 현재 패치 버전: v2.14.60
- 기준 버전: v2.14.59 `thumbnail-width-151-only` 패치
- 주요 변경사항: 오켄바르 목록 HTML과 영웅 데이터의 이미지 경로 2곳을 `watch-guard-hq-41-oakenvar-v21460.png`로 교체. 첨부 PNG 597×840을 변환 없이 그대로 사용. Worker의 이전 오켄바르 경로 참조는 0건.
- 배포/적용 여부: 패치 파일 제작 완료, GitHub 및 사이트 미적용.
- 적용: ZIP의 `_worker.js`와 새 PNG를 업로드. GitHub 저장소에 남은 `watch-guard-hq-41-oakenvar.webp`는 별도로 삭제. ZIP 압축 해제만으로 GitHub 파일 삭제는 수행되지 않음. 이전 이름의 파일을 지워도 Worker는 새 경로만 참조합니다.
- 검증: 첨부 원본과 ZIP의 PNG 바이트 일치, Worker 문법 및 ZIP 무결성 검사.
