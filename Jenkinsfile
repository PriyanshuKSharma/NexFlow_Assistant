pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nexflow-assistant'
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
                sh '. .venv/bin/activate && python -m compileall app.py ai_assistant.py automation.py database.py'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Optional Docker Push') {
            when {
                expression {
                    return env.DOCKERHUB_USERNAME && env.DOCKERHUB_TOKEN
                }
            }
            steps {
                sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin'
                sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}'
                sh 'docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest'
                sh 'docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}'
                sh 'docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest'
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
