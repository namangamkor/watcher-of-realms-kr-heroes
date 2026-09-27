# v2.14.73 · 소환 효과음 교체 및 BGM 음량 조절

- 현재 패치 버전: v2.14.73
- 기준 버전: v2.14.72 `worwiki-v2.14.72-valara-correction.zip` 적용 상태. v2.14.72가 아직 미적용이라면 먼저 적용해야 합니다.
- 변경사항: 소환 효과음 URL을 사용자 제공 10초 WAV의 새 파일명 `/summon-effect-v21473.wav`로 변경. 소환 페이지 BGM의 `volume` 값을 기존 0.30에서 0.21로 변경(기존 대비 30% 감소). BGM 파일 자체와 효과음 재생 로직은 유지합니다.
- 동기화 검수: `_worker.js`만 실제 변경. `app.js`, `heroes.json`은 v2.14.72와 바이트 단위로 동일함을 확인해 ZIP에 함께 수록. 발레리아/발레리야 이미지 경로도 v2.14.72 상태를 유지합니다.
- 배포/적용 여부: 패치 ZIP 제작 완료, GitHub 및 Cloudflare 사이트 미적용.
- 적용: ZIP의 `_worker.js`, `app.js`, `heroes.json`, `summon-effect-v21473.wav`를 사이트 루트에 함께 업로드. v2.14.72의 기존 이미지 파일도 유지하세요.
- 삭제 후보: 기존 `summon-effect.m4a`는 이 패치의 `_worker.js`에서 참조하지 않습니다. 저장소의 다른 참조가 없는지 확인하고 새 WAV가 사이트에서 정상 재생되는 것을 확인한 다음 삭제하세요. BGM 파일 `summon-bgm.m4a`는 유지합니다.
