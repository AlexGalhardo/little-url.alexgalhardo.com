import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import AuthLoginUseCase from "../use-cases/auth-login.use-case";
import AuthLogoutUseCase from "../use-cases/auth-logout.use-case";
import AuthCreateAccountUseCase from "../use-cases/auth-create-account.use-case";
import { Database } from "../config/database.config";

@Module({
    controllers: [AuthController],
    providers: [
        Database,
        {
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(database);
            },
        },
        {
            provide: "AuthLoginUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthLoginUseCase(usersRepository);
            },
        },
        {
            provide: "AuthCreateAccountUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthCreateAccountUseCase(usersRepository);
            },
        },
        {
            provide: "AuthLogoutUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthLogoutUseCase(usersRepository);
            },
        },
    ],
})
export class AuthModule {}
