# 나만겜 워처오브렐름 위키 패치

## 현재 패치 버전
**v2.14.33**

## 기준 버전
**v2.14.32 daily reset / 30회-50회 운명시험 버전**

## 이번 변경
- 데시무스 영웅도감/소환 결과/상세 연동에 사용되는 초상화 교체
- 기존 금빛이 돌아 전설처럼 보이던 데시무스 초상 대신 사용자가 직접 제공한 이미지로 변경
- 미니게임 운명시험 로직, 일일 초기화, 초기화 확인 메시지, 30회/50회 제한, 통계 로직은 그대로 유지
- 소환 효과음(`summon-effect.m4a`) 유지

## 포함 파일
- `_worker.js`
- `README.md`
- `VERSION.txt`
- `APPLY.txt`
- `PROBABILITY_CHECK.txt`
- `summon-effect.m4a`
- `unaffiliated-01-decimus.png`

## 참고
데시무스는 현재 `_worker.js`의 영웅 데이터에서 초상 경로를
`./unaffiliated-01-decimus.png`
로 사용하도록 변경했습니다.
Git 저장소 루트에 같은 이름의 파일을 두면 바로 반영됩니다.
