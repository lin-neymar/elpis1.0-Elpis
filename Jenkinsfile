pipeline {
    agent any
    tools {
        nodejs 'Node18'
    }
    stages {
        stage('拉取代码') {
            steps {
                git credentialsId: 'tgit-ssh', url: 'git@git.code.tencent.com:15813396462/Elpis.git', branch: 'master'
            }
        }
        stage('依赖安装 & ESLint代码校验') {
            steps {
                sh 'npm install'
                sh 'npm run lint'
            }
        }
        stage('前端打包') {
            steps {
                sh 'npm run build'
            }
        }
        stage('构建Docker镜像') {
            steps {
                sh 'docker build -t vue-web:${BUILD_NUMBER} .'
            }
        }
    }
    post {
        success {
            echo '✅CI构建成功'
        }
        failure {
            echo '❌CI构建失败'
        }
    }
}