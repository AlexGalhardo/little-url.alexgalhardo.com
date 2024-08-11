import { UsersRepositoryPort } from "src/repositories/users.repository";
import { ErrorsMessages } from "src/utils/errors-messages.util";

interface VerifyJwtTokenUseCaseResponse {
    success: boolean;
}

export interface VerifyJwtTokenUseCasePort {
    execute(jwtToken: string): Promise<VerifyJwtTokenUseCaseResponse>;
}

export default class VerifyJwtTokenUseCase implements VerifyJwtTokenUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(jwtToken: string): Promise<VerifyJwtTokenUseCaseResponse> {
        try {
            const jwtTokenIsLoggedIn = await this.usersRepository.findByJwtToken(jwtToken);

            if (jwtTokenIsLoggedIn) return { success: true };

            throw new Error(ErrorsMessages.JWT_TOKEN_INVALID);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
