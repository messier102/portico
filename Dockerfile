FROM node:16.10.0
WORKDIR /app
COPY ["package.json", "build", "/app/"]
CMD ["node", "index.js"]
