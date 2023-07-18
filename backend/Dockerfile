FROM	node:18-alpine
# RUN		npm install -g @nestjs/cli
# 웹 서비스 구현 후 볼/륨을 활용해 데이터를 유지하도록 수정한 뒤 새로운 프로젝트를 생성하고 아래 의존성 패키지들을 설치하는 명령을 제거하기
# RUN		nest new application -p npm
WORKDIR	/application
COPY	./application/ .
# RUN		npm install --save class-validator class-transformer @nestjs/typeorm typeorm reflect-metadata pg
RUN		npm install
# 웹 서비스 구현 후 CMD	[ "npm" "start" ]로 바꿔주기
CMD		sleep infinity