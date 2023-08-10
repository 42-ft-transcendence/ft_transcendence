FROM	node:18-alpine
WORKDIR	/application
COPY	./application/ .
RUN		npm install
EXPOSE	3000
# 웹 서비스 구현 후 CMD	[ "npm" "start" ]로 바꿔주기
# CMD		sleep infinity
CMD		npx prisma migrate dev && npx prisma db seed && npm run start:dev