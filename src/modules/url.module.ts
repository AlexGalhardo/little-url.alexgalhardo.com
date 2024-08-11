import { Module } from "@nestjs/common";
import { Database } from "../config/database.config";
import UrlsRepository, { UrlsRepositoryPort } from "src/repositories/urls.repository";
import UrlCreateUseCase from "src/use-cases/url-create.use-case";
import { UrlController } from "src/controllers/url.controller";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";
import UrlListAllByUserUseCase from "src/use-cases/url-list-all-by-user.use-case";
import UrlUpdateByIdUseCase from "src/use-cases/url-update-by-id.use-case";
import UrlDeleteByIdUseCase from "src/use-cases/url-delete-by-id.use-case";
import UsersRepository, { UsersRepositoryPort } from "src/repositories/users.repository";
import VerifyJwtTokenUseCase from "src/use-cases/verify-jwt-token.use-case";

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
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
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
        {
            provide: "UrlListAllByUserUseCasePort",
            inject: ["UrlsRepositoryPort"],
            useFactory: (urlsRepository: UrlsRepositoryPort) => {
                return new UrlListAllByUserUseCase(urlsRepository);
            },
        },
        {
            provide: "UrlUpdateByIdUseCasePort",
            inject: ["UrlsRepositoryPort"],
            useFactory: (urlsRepository: UrlsRepositoryPort) => {
                return new UrlUpdateByIdUseCase(urlsRepository);
            },
        },
        {
            provide: "UrlDeleteByIdUseCasePort",
            inject: ["UrlsRepositoryPort"],
            useFactory: (urlsRepository: UrlsRepositoryPort) => {
                return new UrlDeleteByIdUseCase(urlsRepository);
            },
        },
        {
            provide: "VerifyJwtTokenUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new VerifyJwtTokenUseCase(usersRepository);
            },
        },
    ],
})
export class UrlModule {}
