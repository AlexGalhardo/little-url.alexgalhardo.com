import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";

export interface AuthCheckUserJWTTokenUseCasePort {
    execute(userId: string): Promise<AuthCheckUserJWTTokenUseCaseResponse>;
}

interface AuthCheckUserJWTTokenUseCaseResponse {
    success: boolean;
    data: any;
}

export default class AuthCheckUserJWTTokenUseCase implements AuthCheckUserJWTTokenUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string): Promise<AuthCheckUserJWTTokenUseCaseResponse> {
        const userFound = await this.usersRepository.findById(userId);

        if (userFound) return { success: true, data: userFound };

        throw new Error(ErrorsMessages.USER_NOT_FOUND);
    }
}
