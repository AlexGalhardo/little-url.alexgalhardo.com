import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";

export interface AuthLogoutUseCasePort {
    execute(jwtToken: string): Promise<AuthLogoutUseCaseResponse>;
}

interface AuthLogoutUseCaseResponse {
    success: boolean;
}

export default class AuthLogoutUseCase implements AuthLogoutUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(jwtToken: string): Promise<AuthLogoutUseCaseResponse> {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (userID && (await this.usersRepository.findById(userID))) {
            await this.usersRepository.logout(userID);
            return { success: true };
        }

        throw new Error(ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_EXPIRED_OR_INVALID);
    }
}
