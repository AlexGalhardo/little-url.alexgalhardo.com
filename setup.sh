#!/bin/bash
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
docker-compose down
docker-compose up -d
npx husky
npm run prisma:generate
npm run prisma:migrate
