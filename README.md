# Watcher of Realms KR Heroes

워처 오브 렐름의 한국명 ↔ 영문명 매칭을 위한 간단한 영웅도감입니다.

## 파일 구조

- `index.html` — 메인 페이지
- `styles.css` — 디자인
- `app.js` — 검색 기능
- `heroes.json` — 영웅 이름 데이터

## 영웅 추가 방법

`heroes.json`에 아래 형식으로 항목을 추가합니다.

```json
{
  "id": "valderon",
  "nameKr": "발데론",
  "nameEn": "Valderon",
  "aliases": ["발더론", "와엘드론"]
}
```

현재 데이터는 사이트 구조 테스트용 샘플입니다. 한국 서버 공식 표기 확인 후 확장하는 것을 권장합니다.
