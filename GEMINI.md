# Gemini Context: BizTone Converter

이 문서는 Gemini CLI가 추가적인 지침을 제공하는 데 사용할 수 있도록 BizTone Converter 프로젝트에 대한 포괄적인 개요를 제공합니다.

## 1. 프로젝트 개요

**BizTone Converter**는 사용자가 텍스트를 다양한 대상에게 적합한 전문적인 비즈니스 톤으로 재구성할 수 있도록 돕는 풀스택 웹 애플리케이션입니다. 사용자는 텍스트를 입력하고, 대상(상사, 동료 또는 고객)을 선택하면, 애플리케이션은 Groq AI API를 사용하여 재구성된 메시지를 생성합니다.

프로젝트는 크게 두 가지 부분으로 구성됩니다.

-   **프론트엔드**: 바닐라 **HTML**, **JavaScript**로 구축된 단일 페이지 인터페이스이며, CDN을 통해 로드된 **Tailwind CSS**로 스타일링됩니다. 텍스트 입력, 대상 선택, 변환 결과 표시를 위한 사용자 인터페이스를 제공합니다.
-   **백엔드**: **Python**과 **Flask** 프레임워크를 사용하는 서버입니다. 사용자 텍스트와 대상 선택을 받아들이는 단일 REST API 엔드포인트를 노출하고, 특정 프롬프트를 구성하며, Groq AI API를 호출하여 변환된 텍스트를 가져옵니다.

### 주요 기술

-   **백엔드**: Python, Flask, `python-dotenv`, `Flask-CORS`, `groq`
-   **프론트엔드**: HTML5, JavaScript (ES6+), Tailwind CSS (CDN을 통해)
-   **AI 서비스**: Groq AI API (모델: `moonshotai/kimi-k2-instruct-0905`)

## 2. 프로젝트 빌드 및 실행

### 백엔드 설정 및 실행

1.  **프로젝트 루트 디렉토리로 이동합니다.**

2.  **Python 가상 환경을 생성하고 활성화합니다.**
    ```bash
    # 가상 환경 생성
    python -m venv .venv

    # Windows에서 활성화
    .\.venv\Scripts\activate

    # macOS/Linux에서 활성화
    source .venv/bin/activate
    ```

3.  **의존성을 설치합니다.**
    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **환경 변수를 설정합니다.**
    -   프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.
    -   파일에 Groq API 키를 추가합니다.
        ```
        GROQ_API_KEY="your-api-key-here"
        ```

5.  **Flask 서버를 실행합니다.**
    ```bash
    python backend/app.py
    ```
    백엔드 서버는 `http://127.0.0.1:5000`에서 시작됩니다.

### 프론트엔드 사용

프론트엔드는 Flask 백엔드에서 직접 제공하는 정적 파일 세트입니다.

1.  **백엔드 서버가 실행 중인지 확인합니다.**
2.  웹 브라우저를 열고 **`http://127.0.0.1:5000`**으로 이동합니다.

## 3. 개발 규칙

-   **프로젝트 구조**: 코드는 클라이언트 측 코드용 `frontend` 디렉토리와 서버 측 Python/Flask 애플리케이션용 `backend` 디렉토리로 명확하게 분리되어 있습니다.
-   **API 엔드포인트**: 핵심 기능은 단일 엔드포인트를 통해 노출됩니다.
    -   **URL**: `/api/convert`
    -   **메서드**: `POST`
    -   **요청 본문 (JSON)**:
        ```json
        {
          "text": "사용자의 원본 텍스트",
          "target": "상사" | "타팀 동료" | "고객"
        }
        ```
    -   **응답 본문 (JSON)**:
        ```json
        {
          "original_text": "사용자의 원본 텍스트",
          "converted_text": "AI가 생성한 텍스트",
          "target": "선택된 대상"
        }
        ```
-   **스타일링**: 프론트엔드 스타일링은 `frontend/index.html` 파일 내의 Tailwind CSS 유틸리티 클래스를 사용하여 처리됩니다. 별도의 CSS 파일은 없습니다.
-   **환경 설정**: `GROQ_API_KEY`와 같은 모든 민감한 정보는 프로젝트 루트의 `.env` 파일을 통해 관리되며, 백엔드에서 안전하게 로드됩니다. 클라이언트에는 노출되지 않습니다.
-   **Git 워크플로**: 프로젝트 문서(`PRD.md`)는 버전 관리를 위한 `feature -> develop -> main` 브랜칭 전략을 설명합니다.