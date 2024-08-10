import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import AuthLoginUseCase from "../use-cases/auth-login.use-case";
import AuthLogoutUseCase from "../use-cases/auth-logout.use-case";
import AuthRegisterUseCase from "../use-cases/auth-register.use-case";
import { Database } from "../config/database.config";
import AuthCheckUserJWTTokenUseCase from "../use-cases/auth-check-user-jwt-token.use-case";

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
            provide: "AuthRegisterUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthRegisterUseCase(usersRepository);
            },
        },
        {
            provide: "AuthLogoutUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthLogoutUseCase(usersRepository);
            },
        },
        {
            provide: "AuthCheckUserJWTTokenUseCasePort",
            inject: ["UsersRepositoryPort"],
            useFactory: (usersRepository: UsersRepositoryPort) => {
                return new AuthCheckUserJWTTokenUseCase(usersRepository);
            },
        },
    ],
})
export class AuthModule {}
