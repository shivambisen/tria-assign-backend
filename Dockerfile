FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

EXPOSE 3000
CMD ["node", "index.js"]
