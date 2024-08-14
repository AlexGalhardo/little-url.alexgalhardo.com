<div align="center">
	<h1 align="center"><a href="https://little-url.alexgalhardo.com" target="_blank">little-url.alexgalhardo.com</a></h1>
</div>

https://github.com/user-attachments/assets/20d54596-9e0f-4e85-b745-a6fe0f2b175f

## Introduction

- Code Challenge to Create a URL Shortener

## Technologies
- [NodeJS](https://nodejs.org/en)
- [NestJS](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/)
- [Docker](https://docs.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Features
- [x] CRUD API REST
- [x] Unit Tests using Jest Mocks
- [x] Git Hooks using Husky (pre-commit and pre-push)
- [x] Following clean architecture principles (use-case, repositories, dependency injection, IoC, etc)
- [x] CI/CD using Github Actions (linter, tests, build)
- [x] Middlewares to verify authentication & authorization
- [x] Migrations & Seeds & Database GUI
- [x] Swagger OpenAPI Specification v3 Documentation
- [x] Multi tenant (single database, shared schema)
- [x] Logs & Monitoring
- [x] Zod validation for payload requests
- [x] Security configs (rate-limiter, cors, exception errors handlers, etc)

## How to improve
- [ ] API Gateway using KrankeD
- [ ] Add PM2 process manager
- [ ] Kubernetes for horizontal scaling
- [ ] Terraform
- [ ] Integration tests
- [ ] Load Balancer
- [ ] Improve healthcheck endpoint (databases conections, memory usage, etc)
- [ ] Use Git tags for releases
- [ ] Improve multi tenant approach

## Development Setup Local

- Prerequisites:
   - Install NodeJS version >= 20: <https://nodejs.org/en/download/>
   - Install Docker & Docker-compose: <https://docs.docker.com/get-docker>

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/little-url.alexgalhardo.com.git
```

2. Enter repository
```bash
cd little-url.alexgalhardo.com/
```

3. Install dependencies
```bash
npm install
```

4. Setup your environment variables
```bash
cp .env.example .env
```

5. Create Migrations and Seeds
```bash
chmod +x setup.sh && ./setup.sh
```

6. To Start Prisma Studio:
```bash
npm run prisma:studio
```

7. Start local server
```bash
npm run dev
```

## Build
a. Creating build
```bash
npm run build
```

b. Testing build server locally
```bash
npm run start
```

## Tests

a. Run all unit tests
```bash
npm run test
```

## API Requests

- You can see the HTTP Requests references inside folder [rest-client/](rest-client/)
- You can also see Swagger API documentation in:
   - Localhost: <http://localhost:3000/api>
   - Live: <https://little-url.alexgalhardo.com/api>

## Documentation
- Read and add usefull documentation (markdown, notes, images, best practices, etc) about this project inside folder [docs/](docs/)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
