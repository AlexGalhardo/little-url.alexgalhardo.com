FROM node:latest
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN cp .env.example .env
RUN npm install
RUN npm run prisma:generate
EXPOSE 3000
ENTRYPOINT ["npm", "run", "dev"]
