---
name: architecture-documentation-standards
description: Architecture and documentation standards including SSoT harness pointer structure, docs synchronization on code changes, and subagent task division.
---

# [하네스 가이드 03] 기타 기능 및 구조상 꼭 필요한 기준 (Architecture & Documentation Standards)

이 문서는 AI 어시스턴트와의 일관된 협업 환경을 유지하고, 프로젝트의 유지보수성과 지속 가능성을 높이기 위한 구조 및 문서화 하네스 기준을 정의합니다.

---

## 1. SSoT (Single Source of Truth) 하네스 포인터 구조 구축

- **지침**: 프로젝트 규칙과 AI 가이드라인 원본은 `.ai/agent-context.md` 및 `docs/` 내의 단 1곳(SSoT)에만 관리합니다.
- **실행**:
  - `CLAUDE.md`, `GEMINI.md`, `.claude/commands/`, `.agent/skills/` 등 개별 AI 도구별 지시 파일은 원본을 직접 편집하지 않고, 원본 파일을 읽도록 가리키는 얇은 포인터(Pointer)로 작성합니다.
- **목적**: 사용하는 AI 도구가 달라지더라도 지침이 파편화되거나 서로 충돌하는 현상을 방지합니다.

---

## 2. 코드 변경 시 문서 동기화 필수 원칙 (`docs/` 업데이트)

- **지침**: 로직 변경, 구조 변경, 버그 수정 등 코드에 변화가 생기면 코드 수정만으로 작업을 완료로 보고하지 않습니다.
- **실행**:
  - 관련 기술 문서(`docs/`), 기술 가이드, 또는 주차별 변경 이력(Changelog)을 동시 업데이트합니다.
  - 디버깅 통찰이나 트러블슈팅 이력은 재발 방지를 위해 리팩토링 노트 및 차이 로그에 남겨둡니다.
- **목적**: 프로젝트의 지식 파편화를 막고, 문서가 항상 실제 실행 가능한 최신 상태를 유지하도록 합니다.

---

## 3. 복잡한 작업 시 Subagent(에이전트 역할 분담) 활용

- **지침**: 구현해야 하는 요구사항의 규모가 크거나 난이도가 높을 경우, 한 번에 모든 것을 처리하려 하지 않고 역할을 세분화합니다.
- **실행**:
  - 설계, 구현, 검증, 문서화 등의 역할을 분담하고, 필요 시 `invoke_subagent` 도구나 개별 스킬을 호출하여 독립적이고 유기적으로 작업을 수행하게 지시합니다.
- **목적**: 대규모 작업 시 발생할 수 있는 AI 맥락 손실(Context Overflow)을 방지하고 결과물의 완성도를 극대화합니다.
