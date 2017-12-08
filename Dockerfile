FROM node

WORKDIR /app

COPY package.json .

RUN npm install --production

RUN apt-get clean

COPY . .

EXPOSE 3001

CMD [ "npm", "build" ]