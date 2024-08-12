export const APP_URL =
    process.env.NODE_ENV === "production"
        ? "https://little-url.alexgalhardo.com"
        : `http://localhost:${process.env.PORT}`;

export const ENABLE_TELEGRAM_LOGS = process.env.ENABLE_TELEGRAM_LOGS === "true" ? true : false;

export const ENABLE_DATABASE_DEBUG = process.env.ENABLE_DATABASE_DEBUG === "true" ? true : false;
