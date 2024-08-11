import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";

export interface AuthLogoutUseCasePort {
    execute(userId: string): Promise<AuthLogoutUseCaseResponse>;
}

interface AuthLogoutUseCaseResponse {
    success: boolean;
}

export default class AuthLogoutUseCase implements AuthLogoutUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(userId: string): Promise<AuthLogoutUseCaseResponse> {
        console.log("userId => ", userId);

        const userFound = await this.usersRepository.findById(userId);

        console.log("userFound => ", userFound);

        if (userFound) {
            await this.usersRepository.logout(userId);
            return { success: true };
        }

        throw new Error(ErrorsMessages.USER_NOT_FOUND);
    }
}
