FROM node:16.10.0-alpine
WORKDIR /app
COPY ["package.json", "build", "/app/"]
CMD ["node", "index.js"]
