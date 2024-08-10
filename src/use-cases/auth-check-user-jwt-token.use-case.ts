import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";

export interface AuthCheckUserJWTTokenUseCasePort {
    execute(token: string): Promise<AuthCheckUserJWTTokenUseCaseResponse>;
}

interface AuthCheckUserJWTTokenUseCaseResponse {
    success: boolean;
    data: any;
}

export default class AuthCheckUserJWTTokenUseCase implements AuthCheckUserJWTTokenUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(token: string): Promise<AuthCheckUserJWTTokenUseCaseResponse> {
        const { userID } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (userID && (await this.usersRepository.findById(userID))) {
            const { user } = await this.usersRepository.findById(userID);
            return { success: true, data: user };
        }

        throw new Error(ErrorsMessages.USER_NOT_FOUND);
    }
}
