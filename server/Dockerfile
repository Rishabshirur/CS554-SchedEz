FROM node:slim

WORKDIR /usr/src/app

ENV SERVER_URL='mongodb://host.docker.internal:27017/'
ENV DATABASE='CS_554-Final_Project'
ENV LOCAL_IP="127.0.0.1"
# ENV REDIS_HOST="my-redis-service" 
# ENV REDIS_PORT="6379"



COPY package*.json ./

RUN npm install
RUN apt-get update && apt-get install -y imagemagick



COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]