import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { AuthCreateAccountDTO, AuthCreateAccountUseCasePort } from "./auth-create-account.use-case";
import { mock } from "jest-mock-extended";
import { randomUUID } from "node:crypto";
import * as jwt from "jsonwebtoken";

describe("Test AuthCreateAccountUseCase", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
                { provide: "AuthCreateAccountUseCasePort", useValue: mock<AuthCreateAccountUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create user account", async () => {
        const AuthCreateAccountDTO = mock<AuthCreateAccountDTO>();
        const mockAuthCreateAccountUseCase = mock<AuthCreateAccountUseCasePort>();
        const jwtToken = jwt.sign({ userId: randomUUID() }, "jwtsecret");
        mockAuthCreateAccountUseCase.execute.mockResolvedValueOnce({ success: true, jwt_token: jwtToken });
        const { success, jwt_token } = await mockAuthCreateAccountUseCase.execute(AuthCreateAccountDTO);

        expect(success).toBeTruthy();
        expect(jwt_token).toBe(jwtToken);
    });
});
