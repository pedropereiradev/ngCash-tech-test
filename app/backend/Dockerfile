FROM node:16.14-alpine

WORKDIR /app-backend

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npm run build

CMD [ "npm", "start" ]
