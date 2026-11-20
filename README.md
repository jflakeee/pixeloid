<div align="center">

# ▦ PIXELOID
### 잠든 수로 · The Sleeping Waterway

**작은 구체로 길을 열고, 묻힌 장치에 다시 빛을.**

모바일과 PC에서 즐길 수 있는 브라우저 기반 발굴·성장 게임 프로토타입

### [🎮 지금 게임 데모 플레이하기](https://jflakeee.github.io/pixeloid/)

[게임 실행](https://jflakeee.github.io/pixeloid/) · [개발 기록](https://github.com/jflakeee/pixeloid/actions) · [실험 기능 브랜치](https://github.com/jflakeee/pixeloid/tree/chore/install-gamedev-toolchain-20261120)

</div>

---

## 📸 게임 화면 미리보기

PC와 모바일 게임 화면은 실제 Chromium 브라우저에서 자동 캡처합니다. 이미지 파일은 개발 브랜치의 CI 아티팩트로 제공되며, 공개 README에 이미지를 직접 표시하는 작업은 캡처 검증 후 진행합니다.

**[🖥 PC·📱 모바일 게임 화면 캡처 확인 (GitHub Actions)](https://github.com/jflakeee/pixeloid/actions/workflows/verify-gamedev-toolchain.yml)**

워크플로 실행 결과의 `pixeloid-fx-lab` 아티팩트에서 `game-fx-desktop.png`와 `game-fx-mobile.png`를 확인할 수 있습니다. 해당 아티팩트는 최신 실행이 성공한 경우 생성됩니다.

## 🎮 어떤 게임인가요?

96 × 64 크기의 지형을 발굴하고 광물을 모아 구체를 강화하세요. 서로 다른 역할의 구체를 배치하고, 묻힌 장치를 복원하며 수로의 비밀을 발견하는 게임입니다.

| 구체 종류 | 특징 | 활용 |
| --- | --- | --- |
| 🟢 기본 구체 | 빠른 이동 | 연질층 발굴 |
| 🟠 관통 구체 | 강한 충돌 | 단단한 지형 |
| 🔵 전격 구체 | 연쇄 타격 | 광맥 발굴 |

### 주요 기능

- **직접 목표 지정:** 지도를 눌러 발굴할 위치를 선택합니다.
- **전략적인 구체 운용:** 구체 종류별로 목표를 설정하고 선택한 유형만 이동시킵니다.
- **성장과 업그레이드:** 발굴로 얻은 광물을 사용해 구체 수와 속도를 늘립니다.
- **장치와 유물:** 반사 장치·발전기·유물 목표를 복원합니다.
- **모바일 친화적 조작:** 터치·드래그·핀치 확대/축소를 지원합니다.
- **로컬 저장:** 자동 저장, 백업 복원, 새 탐사 이전 기록 복원을 지원합니다.

## 🚀 플레이 방법

**[▶ 설치 없이 웹에서 바로 시작](https://jflakeee.github.io/pixeloid/)**

1. **발굴 시작**을 누릅니다.
2. 지도를 터치하거나 클릭해 목표를 정합니다.
3. 구체 종류를 선택하고 **선택 유형 보내기**를 누릅니다.
4. 광물을 모아 성장하고, 장치 주변을 발굴해 복원합니다.

> 데모는 실험용 프로토타입입니다. 진행 기록은 해당 브라우저에 저장되며, 브라우저 데이터를 지우면 기록을 잃을 수 있습니다.

## 🛠 개발 현황

| 항목 | 공개 데모 기준 |
| --- | --- |
| 브라우저 게임 플레이 | 구현 |
| PC·모바일 조작 | 구현 |
| 구체 구성·성장·장치 복원 | 구현 |
| 저장·백업·복원 | 구현 |
| Android APK/AAB | 미제작 |
| PixelFX·PlinkFX 실험 기능 | 별도 개발 브랜치에서 검증 중 |

PixelFX 시각 효과와 PlinkFX 효과음 통합은 [개발 브랜치](https://github.com/jflakeee/pixeloid/tree/chore/install-gamedev-toolchain-20261120)에서 진행 중입니다. **공개 데모에 반영된 기능과 개발 중인 기능은 다를 수 있습니다.**

## 💻 개발 환경

별도의 게임 엔진 설치 없이 정적 파일 서버로 실행할 수 있습니다. Node.js는 테스트에 사용합니다.

```bash
git clone https://github.com/jflakeee/pixeloid.git
cd pixeloid
python3 -m http.server 8765 --directory dist
```

브라우저에서 [http://localhost:8765](http://localhost:8765)를 엽니다. ES 모듈을 사용하므로 `file://`로 직접 열지 마세요.

### 테스트

```bash
node test.mjs
node tests/p0-persistence.mjs
```

테스트는 발굴 보상, 구매, 시뮬레이션, 저장 호환성과 오류 상황을 점검합니다. 실제 Android 기기 성능 측정을 대신하지는 않습니다.

## 📁 주요 폴더

```text
dist/               웹 게임 및 배포 파일
  index.html        게임 시작 페이지
  app.mjs           게임 화면과 입력
  core.mjs          발굴·성장 규칙
  storage.mjs       저장·복원 처리
tests/              회귀·저장 테스트
docs/               설계 및 개발 기록
.github/workflows/  자동 검증과 배포
```

## 🗺 다음 목표

- 발굴 효과와 효과음의 실제 플레이 검증
- 저사양 Android 기기 성능·발열 측정
- 저장 호환성 및 다중 탭 안정성 강화
- 검증 완료 후 FX 기능의 공개 배포 검토
- Android 앱 패키징 검토

---

<div align="center">

**PIXELOID · THE SLEEPING WATERWAY**

[🎮 데모 플레이](https://jflakeee.github.io/pixeloid/) · [GitHub 저장소](https://github.com/jflakeee/pixeloid)

</div>
