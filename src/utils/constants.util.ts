const APP_URL =
    process.env.NODE_ENV === "production"
        ? "https://little-url.alexgalhardo.com"
        : `http://localhost:${process.env.PORT}`;

const ENABLE_TELEGRAM_LOGS = process.env.ENABLE_TELEGRAM_LOGS === "true" ? true : false;

const ENABLE_DATABASE_DEBUG = process.env.ENABLE_DATABASE_DEBUG === "true" ? true : false;

export { APP_URL, ENABLE_TELEGRAM_LOGS, ENABLE_DATABASE_DEBUG };
