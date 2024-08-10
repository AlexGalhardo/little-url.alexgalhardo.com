import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.use(helmet());

    const config = new DocumentBuilder()
        .setTitle("Example")
        .setDescription("Little URL API Documentation")
        .setVersion("1.0")
        .addTag("example")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);

    await app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
        console.log(`\n\nlittle-url.alexgalhardo.com running on http://localhost:${Number(process.env.PORT) || 3000}`);
        console.log(`\n\n...Using DOCKER POSTGRES Database!\n\n`);
    });
}

bootstrap();
