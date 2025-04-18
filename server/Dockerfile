FROM node:18 AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 4000

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS test
RUN npm install
COPY . .
CMD ["npm", "test"]