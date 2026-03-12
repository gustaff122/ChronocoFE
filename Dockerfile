FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build --configuration=production --output-path=dist/ChronocoFE/server

FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist/ChronocoFE/ ./

EXPOSE 1404

WORKDIR /app/server
CMD ["node", "server.mjs"]