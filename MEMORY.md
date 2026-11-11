# Pixeloid 작업 메모리

업데이트: 2026-11-11 (Asia/Seoul). 다음 세션에서는 이 파일과 production/project-stage-report.md를 읽고 원격 main 및 Actions 상태를 다시 확인한다.

## 목표와 운영 원칙

- 저장소: https://github.com/jflakeee/pixeloid (main)
- 공개 데모: https://jflakeee.github.io/pixeloid/
- 목표: 10 Million Pixels 벤치마크 기반 웹 샘플 개선, 이후 Android 배포.
- 사용자는 작업 완료마다 테스트·커밋·배포를 요청했다. 구현, 커밋, 배포 성공, 실제 플레이·시각 검증을 구분하여 보고한다.
- 기존 기능·Git 기록·저장 호환성을 보존한다. 미검증 항목을 완료로 표시하지 않는다.

## 현재 구현

- v0.10 웹 샘플. Canvas 2D와 JavaScript ES 모듈; dist/가 소스이자 Pages 배포 대상. 별도 번들러·런타임 패키지 없음.
- 96×64 채굴 지도, 기본/관통/전격 구체, 3–12개 구성, 유형별 목표 및 그룹 재배치, 성장, 반사판·발전기·핵심 유물.
- 모바일 시트·일시정지, 탭/드래그 구분, 기준점을 유지하는 확대/핀치, 화면 숨김 처리.
- 저장 키 pixeloid-demo-v1, 데이터 버전 2, v1 마이그레이션 유지. 자동 저장 백업과 새 탐사 이전 스냅샷 복원 지원.
- 최근 게임 변경 42432ac: 복원 가능 장치 수·알림. 주변 24칸 중 19칸은 불가, 20칸부터 복원 가능; 완료 장치는 제외.
- Android는 계획만 존재. Capacitor 래퍼·서명 APK/AAB·실기기 검증 없음.

## 프레임워크 설치

- Claude Code Game Studios 1.3.0 설치 커밋: 079b62d5e2609aafb1292ce21f0f51d8e889b762.
- 원본 고정 커밋: abc0de79d6ceb0b5d7aa693945849b3937afbe6a.
- 스킬 디렉터리 78개, 에이전트 49개. standard / autonomous / Web, code_root=dist, test_root=.
- 원본 .github·src는 제외해 기존 게임·배포 워크플로를 보존했다. 상세: vendor/claude-code-game-studios/INSTALLATION.md.
- 설정 JSON과 쉘 스크립트 68개 문법 검사 통과. 설치 환경에 claude 실행기가 없어 Claude Code 내부 명령·훅 실행은 미검증.

## 프로젝트 단계 진단

- 상세 보고서: production/project-stage-report.md. 저장소의 코드·문서·테스트를 확인한 결과이며 외부 설계 원문은 범위 밖이다.
- 설정 단계 Production, 관찰 단계 Pre-Production(플레이 가능한 웹 프로토타입), 신뢰도 CONCERNS. project.yaml 단계는 변경하지 않았다.
- 게임 모듈 4개와 HTML/CSS 2개. 파일 수 기준은 보조 지표이며 이를 맞추려고 코드를 분할하지 않는다.
- 프로젝트 GDD·시스템 인덱스·기반 ADR 없음. 빈 템플릿과 프레임워크 문서를 게임 설계 완료로 세지 않는다.
- 테스트 1개 파일에서 8개 PASS 그룹 확인. 전체 목표 경로는 구체 12개 선지급·반복 재배치 합성 테스트이므로 일반 플레이 시간·경제 밸런스 검증이 아니다.
- 모바일 실제 화면/터치, 장시간 성능, Android 생명주기는 미검증.

## 다음 작업

1. /reverse-document design dist로 현 구현을 역문서화하고 향후 계획과 분리한다.
2. /map-systems로 시스템별 상태·의존성·우선순위를 정리한다.
3. 채굴/보상·구체/장치·저장/복원의 핵심 GDD와 Canvas/저장/배포 기반 ADR 작성.
4. 모바일 조작·복원·백그라운드 전환을 실제 검증한 뒤 Android 구현 범위를 정한다.

## 검증 및 배포

- 테스트: node test.mjs
- 문법 검사: node --check를 dist/core.mjs, dist/app.mjs, dist/input.mjs, dist/storage.mjs에 각각 실행.
- main 푸시 시 기존 Actions가 테스트 후 dist/만 Pages에 게시한다. 메모리·진단 문서는 저장소에서 읽으며 데모 화면에는 게시되지 않는다.
- 설치 커밋 배포는 Actions 42982947828에서 success 확인. 이 메모리 변경의 배포 상태는 해당 커밋 SHA의 Actions에서 별도 확인한다.
- Git CLI 푸시 인증이 없던 환경에서는 연결된 GitHub create_tree/create_commit/update_ref를 사용했다. 최신 원격 SHA와 expected_sha로 충돌을 방지하고 강제 푸시하지 않는다.
