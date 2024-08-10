const APP_URL =
    process.env.NODE_ENV === "production"
        ? "https://little-url.alexgalhardo.com"
        : `http://localhost:${process.env.PORT}`;

export default APP_URL;
