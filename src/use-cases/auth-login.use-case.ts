import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import AuthLoginValidator from "src/validators/auth-login.validator";

export interface AuthLoginUseCasePort {
    execute(authLoginDTO: AuthLoginDTO): Promise<UserLoginUseCaseResponse>;
}

export interface AuthLoginDTO {
    email: string;
    password: string;
}

interface UserLoginUseCaseResponse {
    success: boolean;
    jwt_token?: string;
    message?: string;
}

export default class AuthLoginUseCase implements AuthLoginUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(authLoginPayload: AuthLoginDTO): Promise<UserLoginUseCaseResponse> {
        AuthLoginValidator.parse(authLoginPayload);

        const { email, password } = authLoginPayload;

        if (email && password) {
            const user = await this.usersRepository.findByEmail(email);

            if (user) {
                const passwordIsValid = await Bcrypt.compare(password, user.password);

                if (!passwordIsValid) return { success: false, message: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };

                const jwt_token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

                await this.usersRepository.updateJwtToken(user.id, jwt_token);

                return { success: true, jwt_token };
            }

            throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
        }

        throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
