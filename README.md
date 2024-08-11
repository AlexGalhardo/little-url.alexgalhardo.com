<div align="center">
	<h1 align="center"><a href="https://little-url.alexgalhardo.com" target="_blank">little-url.alexgalhardo.com</a></h1>
</div>

## Introduction

- Code Challenge to Create a URL Shortener

## Development Setup Local

- Prerequisites:
   - Install NodeJS >= v20: <https://nodejs.org/en/download/>
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

- You can see the HTTP Requests references inside folder [**rest-client/**](rest-client/)
- You can also see Swagger API documentation in: <http://localhost:3000/api>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
