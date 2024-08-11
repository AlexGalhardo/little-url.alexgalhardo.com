import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import AuthCreateAccountValidator from "src/validators/auth-register.validator";

interface AuthCreateAccountUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export interface AuthCreateAccountDTO {
    name: string;
    email: string;
    password: string;
}

export interface AuthCreateAccountUseCasePort {
    execute(AuthCreateAccountPayload: AuthCreateAccountDTO): Promise<AuthCreateAccountUseCaseResponse>;
}

export default class AuthCreateAccountUseCase implements AuthCreateAccountUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(AuthCreateAccountPayload: AuthCreateAccountDTO): Promise<AuthCreateAccountUseCaseResponse> {
        AuthCreateAccountValidator.parse(AuthCreateAccountPayload);

        const { name, email, password } = AuthCreateAccountPayload;

        const emailAlreadyRegistered = await this.usersRepository.findByEmail(email);

        if (!emailAlreadyRegistered) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

            await this.usersRepository.create({
                id: userId,
                name: name,
                email: email,
                password: await Bcrypt.hash(password),
                jwt_token: jwt_token,
                created_at: new Date(),
            });

            return { success: true, jwt_token };
        }

        throw new Error(ErrorsMessages.EMAIL_ALREADY_Registered);
    }
}
