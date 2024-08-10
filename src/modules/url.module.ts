import { Module } from "@nestjs/common";
import { Database } from "../config/database.config";
import UrlsRepository, { UrlsRepositoryPort } from "src/repositories/urls.repository";
import UrlCreateUseCase from "src/use-cases/url-create-use-case";
import { UrlController } from "src/controllers/url.controller";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";

@Module({
    controllers: [UrlController],
    providers: [
        Database,
        {
            provide: "UrlsRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UrlsRepository(database);
            },
        },
        {
            provide: "UrlCreateUseCasePort",
            inject: ["UrlsRepositoryPort"],
            useFactory: (urlsRepository: UrlsRepositoryPort) => {
                return new UrlCreateUseCase(urlsRepository);
            },
        },
        {
            provide: "UrlRedirectUseCasePort",
            inject: ["UrlsRepositoryPort"],
            useFactory: (urlsRepository: UrlsRepositoryPort) => {
                return new UrlRedirectUseCase(urlsRepository);
            },
        },
    ],
})
export class UrlModule {}
