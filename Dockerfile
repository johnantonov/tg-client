FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx tsc

VOLUME ["/app/session.txt"]

CMD ["node", "dist/scheduler.js"]
