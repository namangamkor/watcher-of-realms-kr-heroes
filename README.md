# 나만겜 워처오브렐름 위키 패치

## 현재 패치 버전
**v2.14.35**

## 기준 버전
**v2.14.34**

## 이번 변경
- 변경 전 소환 페이지 화면을 `summon-page-before-v2.14.35.png`로 백업
- 기존 소환 오브젝트 HTML/CSS를 `SUMMON_ORB_LEGACY.txt`로 보존
- 파란 수정 중심의 2.5D/3D 회전형 소환 오브젝트로 교체
- 소환 중 수정과 외곽 금속 링이 더 빠르게 회전
- WebGL/3D 라이브러리 없이 CSS만 사용
- 메인 타이틀을 의도적인 2줄 중앙 정렬로 수정
- 기존 메인 4개 바로가기 메뉴는 그대로 유지
- 메인 페이지 우측에 따라다니는 `소환 운명 시험` 플로팅 CTA 추가
- 모바일에서는 우측 하단 소형 플로팅 버튼으로 자동 변경
- v2.14.34의 확률, 30회/50회 제한, 일일 초기화, 수동 초기화 확인창, 통계, 효과음 모두 유지

## 포함 파일
- `_worker.js`
- `README.md`
- `VERSION.txt`
- `APPLY.txt`
- `PROBABILITY_CHECK.txt`
- `summon-effect.m4a`
- `unaffiliated-01-decimus.png`
- `SUMMON_ORB_LEGACY.txt`
- `summon-page-before-v2.14.35.png`

## 배포
ZIP 내부 파일을 Git 저장소 루트에 그대로 덮어씁니다.
