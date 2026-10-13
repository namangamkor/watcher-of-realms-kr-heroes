# worwiki v2.14.133 — 분기 페이지 Worker 내장본 동기화

기준 v2.14.132. 배포 미실행. 기존 배포 폴더에 덮어쓰는 누적 패치. 기존 V4.0 페이지와 이미지 파일 유지.

원인: /gear-presets는 정적 HTML 대신 _worker.js의 WW_PRESET_HUB_HTML을 응답함. HTML만 갱신해 이전 디자인이 계속 표시됨.

gear-presets.html과 Worker 내장본을 동일하게 갱신. 제목 옆 v2.14.133 표기. 반드시 _worker.js도 함께 배포.

검증: 내장본/HTML 완전 동일, Worker 문법 및 GET/HEAD/리다이렉트 응답 검증. app.js·heroes.json·END 상세·설정 데이터 보존. 실제 브라우저 렌더 미검수.
