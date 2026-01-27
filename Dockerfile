FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  vips


COPY package*.json tsconfig.json ./


RUN npm ci


COPY src ./src

RUN npm run build

RUN npm prune --omit=dev

ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]
