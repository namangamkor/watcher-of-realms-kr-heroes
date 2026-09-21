# v2.14.12 복원 및 검증 기록

## 복원 기준
v2.13.4 전체본과 이후 48개 패치, 최종 v2.14.11 장비 제목 수정본을 순서대로 적용했습니다.
작업 당시 운영 메인·뉴비 HTML 및 app.js·styles.css와 복원본이 동일함을 확인했습니다.

## 사용한 전체본·패치
- worwiki-v2.13.4-recent-updates-collection-full.zip
- worwiki-v2.13.4a-emergency-hotfix.zip
- worwiki-v2.13.4b-main-copy-patch.zip
- worwiki-v2.13.4c-main-ui-compact-patch.zip
- worwiki-v2.13.4d-detail-ui-refine-patch.zip
- worwiki-v2.13.4e-missing-detail-fill-patch-user.zip
- worwiki-v2.13.4f-nickname-moderation-patch.zip
- worwiki-v2.13.4g-hero-summary-ui-patch.zip
- worwiki-v2.13.4h-wiki-search-integrated-patch.zip
- worwiki-v2.13.4i-helpful-votes-patch.zip
- worwiki-v2.13.4j-first-report-email-patch.zip
- worwiki-v2.13.4k-comment-form-ui-patch.zip
- worwiki-v2.13.4l-search-affordance-patch.zip
- worwiki-v2.13.4m-search-purple-accent-patch.zip
- worwiki-v2.13.4n-search-wrapper-purple-patch.zip
- worwiki-v2.13.4o-search-wrapper-soft-patch.zip
- worwiki-v2.13.4p-search-wrapper-visible-patch.zip
- worwiki-v2.13.4q-search-wrapper-lighter-patch.zip
- worwiki-v2.13.4r-search-card-depth-patch.zip
- worwiki-v2.13.4s-search-crystal-blue-patch.zip
- worwiki-v2.13.4t-search-crystal-tuned-patch.zip
- worwiki-v2.13.4u-watchguard-gear-patch.zip
- worwiki-v2.13.4v-seo-crawl-links-patch.zip
- worwiki-v2.13.4w-watchguard-gear-final-patch.zip
- worwiki-v2.13.4x-watchguard-gear-bilingual-patch.zip
- worwiki-v2.13.4y-ingrid-infernal-roar-hotfix.zip
- worwiki-v2.13.4z-watchguard-gear-reaudit-patch.zip
- worwiki-v2.13.4z1-diaochan-wings-hotfix.zip
- worwiki-v2.13.4z2-watchguard-endgame-only-patch.zip
- worwiki-v2.13.5a-north-throne-endgame-gear-patch.zip
- worwiki-v2.13.5b-nightmare-council-endgame-gear-patch.zip
- worwiki-v2.13.5c-cursed-cult-endgame-gear-patch.zip
- worwiki-v2.13.5d-infernal-endgame-gear-patch.zip
- worwiki-v2.13.6-star-piercers-endgame-gear-patch.zip
- worwiki-v2.13.7-esoteria-endgame-gear-patch.zip
- worwiki-v2.13.8-chaos-dominion-endgame-gear-patch.zip
- worwiki-v2.13.9-supreme-arbiters-endgame-gear-patch.zip
- worwiki-v2.14.0-unnamable-endgame-gear-patch.zip
- worwiki-v2.14.1-titan-transcendence-content-patch.zip
- worwiki-v2.14.2-watch-guard-artifact-patch.zip
- worwiki-v2.14.3-north-throne-artifact-patch.zip
- worwiki-v2.14.4-content-protection-patch.zip
- worwiki-v2.14.5-watch-guard-gear-reaudit-patch.zip
- worwiki-v2.14.6-north-throne-gear-reaudit-patch.zip
- worwiki-v2.14.7-nightmare-council-gear-reaudit-patch.zip
- worwiki-v2.14.8-cursed-cult-gear-reaudit-patch.zip
- worwiki-v2.14.9-hero-detail-hotfix.zip
- worwiki-v2.14.10-gear-readability-patch.zip
- worwiki-title-fix.zip

## 검증 결과
```json
{
  "worker": {
    "version": "2.14.12",
    "heroes": 256,
    "orderedHeroes": 256,
    "explicitPriority": 46,
    "heroPagesUnchanged": 256,
    "gearPagesUnchanged": 24,
    "workerRoutes": "PASS",
    "staticOrder": "PASS",
    "newbieVideo": "PASS",
    "existingDataProtection": "PASS"
  },
  "dom": {
    "method": "jsdom execution of full app.js against actual Worker HTML and JSON route",
    "initialRender": "PASS",
    "factions": 10,
    "filters": 21,
    "koreanAndEnglishSearch": "PASS",
    "luluCorrection": "PASS",
    "emptySearch": "PASS",
    "staticFallback": "PASS",
    "newbieLink": "PASS",
    "errors": [],
    "visualBrowserCheck": "NOT RUN: Chromium unavailable"
  }
}
```

## 전달 파일 SHA-256
- APPLY-v2.14.12.txt: 7a6dea6c232121787b98bac933161f6007627488630e5c2fd9cf635e5b816510
- _worker.js: 051eea1ab32b321199184886f2e499798539bc4cb9d92345a81721b3dfdab18c
- app.js: 9a30c97c284132b4e5b0d3536a34b985e988acda8a0ee90a58c2e8944d4a7a4e
- gear-detail-readable.css: 2925769f3ba4fc922bf3d6bcdafcf27dfcca0a90ea2e72c3ebc21b91844a1cab
- index.html: 240c0b30ed1b213ddb9472cdae368d53f1066dfcfe60abb4ae52c7029bf6bfeb
- newbie/index.html: 8116200c86fb2b30f2ba9bb8377fff1c64e85d2e1858c036c359172e26d6358f
- sw.js: 6f5ac3b868a71513225613fb7dfd709c0a3304cf8dd5d1b27c454194f7bad614
