FROM node:18 AS base

WORKDIR /app

# Копируем только файлы зависимостей
COPY package.json ./

# Устанавливаем зависимости
RUN npm set registry https://registry.npmmirror.com/ && npm install --ignore-scripts
# RUN npm install

EXPOSE 4000

FROM base AS dev
RUN addgroup --system nonroot && adduser --system --ingroup nonroot nonroot
USER nonroot
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS test
RUN addgroup --system nonroot && adduser --system --ingroup nonroot nonroot
USER nonroot
COPY . .
CMD ["npm", "run", "test:coverage"]
