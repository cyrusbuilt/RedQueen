FROM node:20-alpine as build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist/redqueen-app /usr/share/nginx/html

EXPOSE 80
