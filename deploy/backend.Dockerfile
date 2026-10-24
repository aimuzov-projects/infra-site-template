# Сервис API: Node запускает TypeScript сам, зависимостей нет, сборка не нужна.
# Контекст сборки -- корень репо. Когда появится общий с сайтом код в `src/shared`,
# его копируют сюда так же, как `src/backend`.

FROM node:26.11.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY src/backend ./src/backend
USER node
EXPOSE 8787
CMD ["node", "src/backend/server.ts"]
