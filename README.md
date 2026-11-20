<div align="center">

# ▦ PIXELOID
### 잠든 수로를 깨우다

**작은 구체로 길을 열고, 묻힌 장치에 다시 빛을.**

모바일 터치 조작을 중심으로 제작 중인 브라우저 기반 발굴·성장 게임 프로토타입입니다.

[🎮 공개 데모 플레이](https://jflakeee.github.io/pixeloid/) · [🛠 개발 브랜치](https://github.com/jflakeee/pixeloid/tree/chore/install-gamedev-toolchain-20261120) · [✅ CI 검증](https://github.com/jflakeee/pixeloid/actions)

</div>

---

## 🎮 게임 소개

96 × 64 크기의 지도를 구체로 발굴하며 광물을 모으고, 장치를 복원해 잠든 수로의 비밀을 발견하세요. 구체마다 역할이 다르기 때문에 목표 지점과 구성을 바꾸는 선택이 중요합니다.

| 구체 | 역할 | 추천 대상 |
| --- | --- | --- |
| 기본 구체 | 빠른 이동과 일반 발굴 | 연질층 |
| 관통 구체 | 단단한 지형을 강하게 타격 | 경질층 |
| 전격 구체 | 주변으로 연쇄 타격 | 광맥 |

### 핵심 기능

- **탐사와 발굴:** 지도의 목표를 지정하고 구체를 보내 지형을 제거합니다.
- **성장:** 광물로 구체를 추가하고 이동 속도를 강화합니다.
- **구성 변경:** 보유 구체를 세 유형으로 재배분하고 선택한 유형만 재배치합니다.
- **장치 복원:** 장치 주변을 발굴해 반사 장치·발전기·유물을 발견합니다.
- **모바일 조작:** 터치, 드래그, 핀치 줌과 일시정지를 지원합니다.
- **진행 보존:** 브라우저 로컬 저장, 백업 복원, 새 탐사 이전 기록 복원 기능을 제공합니다.

## 🚀 바로 플레이

**[GitHub Pages 데모 열기](https://jflakeee.github.io/pixeloid/)**

1. **발굴 시작**을 누릅니다.
2. 지도에서 목표 지점을 선택합니다.
3. 구체 종류를 선택하고 **선택 유형 보내기**를 누릅니다.
4. 획득한 광물로 성장하고, 장치 주변을 발굴해 복원합니다.

> 공개 데모는 배포된 `main` 버전입니다. 이 README가 있는 개발 브랜치의 최신 FX 기능이 공개 데모에 아직 반영되지 않았을 수 있습니다.

## 🧪 개발 및 검증 현황

| 영역 | 현황 |
| --- | --- |
| 브라우저 플레이 가능한 프로토타입 | 구현 |
| 모바일 터치 조작 | 구현 |
| 저장·복원 및 다중 탭 보호 | 구현 및 회귀 테스트 |
| PixelFX 시각 효과 | 개발 브랜치 통합·CI 검증 |
| PlinkFX 효과음 | 개발 브랜치 통합·CI 검증 |
| 모바일 Chromium 자동 테스트 | 통과 이력 있음 |
| 실제 Android 기기 FPS·발열 검증 | 미완료 |
| Android APK/AAB | 미제작 |
| 최신 FX 공개 배포 | 미진행 |

### FX 배포 후보

개발 브랜치에서는 PixelFX와 PlinkFX를 빌드해 게임에 연결하고 있습니다. `dist/fx-runtime.mjs`는 저장소에 직접 커밋하는 파일이 아니라 CI에서 생성하는 산출물입니다.

검증에 성공한 GitHub Actions 실행의 **`pixeloid-fx-release-candidate`** 아티팩트에서 정적 게임 파일과 FX 번들을 함께 확인할 수 있습니다. 아티팩트 생성이 공개 배포를 의미하지는 않습니다.

- [FX 배포 검증 체크리스트](docs/fx-release-gate.md)
- [GitHub Actions 실행 내역](https://github.com/jflakeee/pixeloid/actions)

## 💻 로컬 실행

Node.js와 Python 3가 준비된 환경을 기준으로 합니다.

```bash
git clone https://github.com/jflakeee/pixeloid.git
cd pixeloid
python3 -m http.server 8765 --directory dist
```

브라우저에서 `http://localhost:8765`를 엽니다. ES 모듈을 사용하므로 `file://`로 직접 열지 마세요.

### 테스트

```bash
node test.mjs
node tests/p0-persistence.mjs
```

개발 브랜치의 FX 빌드는 Git 서브모듈 초기화와 npm 설치가 필요합니다.

```bash
git checkout chore/install-gamedev-toolchain-20261120
git submodule update --init --recursive
cd tools/fx-lab
npm install --no-package-lock
npm run build
```

이 빌드는 `dist/fx-runtime.mjs`를 생성합니다. 효과 모듈을 포함한 결과물은 검증 없이 공개 Pages에 배포하지 마세요.

## 📁 프로젝트 구조

```text
dist/                    브라우저 게임 및 정적 배포 파일
  index.html             게임 진입점
  app.mjs                화면·입력·게임 루프
  core.mjs               발굴 및 진행 규칙
  storage.mjs            저장·복원
  feedback-events.mjs    개발 브랜치 FX 이벤트 감지
tests/                   저장·브라우저 회귀 테스트
tools/fx-lab/            PixelFX·PlinkFX 실험실과 빌드
third_party/gamedev/     고정 버전 개발 도구 서브모듈
docs/                    설계 및 검증 기록
.github/workflows/       자동 테스트·배포 파이프라인
```

## 🗺 향후 계획

1. 실제 발굴 플레이 중 시각 효과와 효과음의 동작 검증
2. 저사양 Android 기기에서 FPS·메모리·발열 측정
3. 기존 저장 형식 호환성과 다중 탭 안전성 재확인
4. 검증된 FX 번들의 스테이징 테스트 및 공개 배포 결정
5. Android 패키징 검토

## 📌 프로젝트 안내

현재 프로젝트는 **개발 중인 플레이 가능한 프로토타입**입니다. 정식 출시 게임이나 완성된 Android 앱이 아닙니다. 게임 진행 기록은 브라우저 로컬 저장소에 보관되므로 브라우저 데이터를 삭제하면 기록을 잃을 수 있습니다.

외부 FX 라이브러리와 개발 도구의 라이선스는 각 원본 저장소 및 서브모듈의 라이선스 파일을 따릅니다.

---

<div align="center">

**PIXELOID · THE SLEEPING WATERWAY**

*작은 구체에서 시작되는 발굴과 발견.*

</div>
