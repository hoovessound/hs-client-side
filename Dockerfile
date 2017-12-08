FROM node

WORKDIR /app

COPY package.json .

RUN npm install --production

RUN apt-get clean

COPY . .

CMD [ "npm", "build" ]

RUN npm install -g serve

CMD serve -s build

EXPOSE 5000