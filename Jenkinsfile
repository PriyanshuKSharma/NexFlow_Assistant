pipeline {
    agent any

    environment {
        BACKEND_IMAGE_NAME = 'nexflow-backend'
        FRONTEND_IMAGE_NAME = 'nexflow-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Up Python') {
            steps {
                sh 'python3 -m venv .venv'
                sh '. .venv/bin/activate && python -m pip install --upgrade pip'
                sh '. .venv/bin/activate && python -m pip install -r requirements.txt'
            }
        }

        stage('Code Validation') {
            steps {
                sh '. .venv/bin/activate && python -m compileall backend app.py ai_assistant.py automation.py database.py'
            }
        }

        stage('Build React Frontend') {
            steps {
                sh 'cd frontend && npm install'
                sh 'cd frontend && npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -t ${BACKEND_IMAGE_NAME}:latest .'
                sh 'docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -t ${FRONTEND_IMAGE_NAME}:latest ./frontend'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    sh 'echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin'
                    sh 'docker tag ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${IMAGE_TAG}'
                    sh 'docker tag ${BACKEND_IMAGE_NAME}:latest ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:latest'
                    sh 'docker tag ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}'
                    sh 'docker tag ${FRONTEND_IMAGE_NAME}:latest ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:latest'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${IMAGE_TAG}'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:latest'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:latest'
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo 'NexFlow Assistant CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'NexFlow Assistant CI/CD pipeline failed. Check the stage logs.'
        }
    }
}
