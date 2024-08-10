import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import AuthRegisterValidator from "src/validators/auth-register.validator";

interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export interface AuthRegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface AuthRegisterUseCasePort {
    execute(authRegisterPayload: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(authRegisterPayload: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse> {
        AuthRegisterValidator.parse(authRegisterPayload);

        const { name, email, password } = authRegisterPayload;

        const emailAlreadyRegistred = await this.usersRepository.findByEmail(email);

        if (!emailAlreadyRegistred) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);

            await this.usersRepository.create({
                id: userId,
                name,
                email,
                password: await Bcrypt.hash(password),
                jwt_token,
                created_at: String(new Date()),
                updated_at: null,
            });

            return { success: true, jwt_token };
        }

        throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
