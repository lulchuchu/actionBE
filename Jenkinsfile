pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'docker build -t $DOCKER_IMAGE .'
      }
    }
    stage('Deploy') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
          sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin docker.io"
          sh 'docker push $DOCKER_IMAGE'
        }
      }
    }
    stage('Build on instance') {
      steps {
        sshagent(credentials: ['ssh-cred']) {
            sh """
                ssh -o StrictHostKeyChecking=no ec2-user@3.107.50.218 '
                    if docker ps | grep -q lulbe1; then
                      docker stop lulbe1
                    else
                      echo "Container is not running."
                    fi
                    if docker ps | grep -q lulbe2; then
                      docker stop lulbe2
                    else
                      echo "Container is not running."
                    fi
                    if docker ps | grep -q nginx-docker; then
                      docker stop nginx-docker
                    else
                      echo "Container is not running."
                    fi
                    if docker network ls | grep -q lul-net; then
                      docker network remove lul-net
                    else
                      echo "Lul-net not exist."
                    fi
                    if docker volume ls | grep -q nginx.conf; then
                      docker volume remove nginx.conf
                    else
                      echo "nginx-conf not exist."
                    fi
                    docker pull tienanhknock/lulbackend
                    docker network create lul-net
                    docker run --rm --name lulbe1 --hostname lulbe1 --network lul-net -e LISTENING_PORT=8090 -d tienanhknock/lulbackend
                    docker run --rm --name lulbe2 --hostname lulbe2 --network lul-net -e LISTENING_PORT=8090 -d tienanhknock/lulbackend
                    docker run --rm --name nginx-docker --network lul-net -p 80:8090 -d -v /home/ec2-user/nginx.conf:/etc/nginx/nginx.conf nginx
                '
            """
        }
      }
    }
    stage('Clean up workspace') {
      steps {
        cleanWs()
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
