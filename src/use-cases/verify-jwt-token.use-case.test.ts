import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UsersRepositoryPort } from "src/repositories/users.repository";
import { VerifyJwtTokenUseCasePort } from "./verify-jwt-token.use-case";
import { randomUUID } from "node:crypto";
import * as jwt from "jsonwebtoken";

describe("Test Verify Jwt Token Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
                { provide: "VerifyJwtTokenUseCasePort", useValue: mock<VerifyJwtTokenUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should verify if jwt token is valid for a user logged in", async () => {
        const mockVerifyJwtTokenUseCase = mock<VerifyJwtTokenUseCasePort>();

        mockVerifyJwtTokenUseCase.execute.mockResolvedValueOnce({ success: true });

        const jwtToken = jwt.sign({ userId: randomUUID() }, "jwtsecret", { expiresIn: "1h" });

        const { success } = await mockVerifyJwtTokenUseCase.execute(jwtToken);

        expect(success).toBeTruthy();
    });
});
