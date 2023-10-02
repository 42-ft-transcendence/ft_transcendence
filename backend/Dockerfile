FROM	node:18-alpine
WORKDIR	/application
COPY	./application/ .
RUN		npm install
RUN		chmod 777 ./backend.sh && chown 777 ./backend.sh
EXPOSE	3000
# 웹 서비스 구현 후 CMD	[ "npm" "start" ]로 바꿔주기
CMD		./backend.sh