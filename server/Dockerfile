FROM node:18 AS base

WORKDIR /app

# Копируем только файлы зависимостей
COPY package.json ./

# Устанавливаем зависимости
RUN npm set registry https://registry.npmmirror.com/ && npm install
# RUN npm install

EXPOSE 4000

FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS test
COPY . .
CMD ["npm", "run", "test:coverage"]
