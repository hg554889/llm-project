# LLM Project

이 프로젝트는 사용자가 입력한 자기소개서를 특정 기업에 맞춰 수정해주는 웹 애플리케이션입니다. 이 애플리케이션은 직접 수집한 자료를 바탕으로 LLM 모델을 만들어 허깅페이스에 업로드 후 API로 가져와 사용자에게 제공하는 방식을 사용합니다.

## 주요 기능
- 사용자가 입력한 자기소개서를 분석
- 특정 기업에 맞춘 자기소개서 수정 제안
- AI를 통한 맞춤형 피드백 제공

## 기술 스택
- 프론트엔드: React
- 백엔드: Node.js, Express
- AI 모델: Hugging Face API
- 데이터베이스: MongoDB

## 설치 및 실행 방법
1. 레포지토리를 클론합니다.
    ```bash
    git clone https://github.com/your-username/llm-project.git
    ```
2. 프로젝트 디렉토리로 이동합니다.
    ```bash
    cd llm-project
    ```
3. 필요한 패키지를 설치합니다.
    ```bash
    npm install
    ```
4. 애플리케이션을 실행합니다.
    ```bash
    npm start
    ```

## 기여 방법
1. 이 레포지토리를 포크합니다.
2. 새로운 브랜치를 만듭니다.
    ```bash
    git checkout -b feature-branch
    ```
3. 변경 사항을 커밋합니다.
    ```bash
    git commit -m "Add new feature"
    ```
4. 브랜치에 푸시합니다.
    ```bash
    git push origin feature-branch
    ```
5. 풀 리퀘스트를 생성합니다.

## 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.