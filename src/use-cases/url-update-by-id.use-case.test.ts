import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UsersRepositoryPort } from "src/repositories/users.repository";
import { UrlUpdateByIdUseCaseDTO, UrlUpdateByIdUseCasePort } from "./url-update-by-id.use-case";

describe("Test Update Url By Id Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
                { provide: "UrlUpdateByIdUseCasePort", useValue: mock<UrlUpdateByIdUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update url origin by id", async () => {
        const UrlUpdateByIdDTO = mock<UrlUpdateByIdUseCaseDTO>();

        const mockUrlUpdateByIdUseCase = mock<UrlUpdateByIdUseCasePort>();

        mockUrlUpdateByIdUseCase.execute.mockResolvedValueOnce({
            success: true,
            data: {
                id: "4a3d8077-e7bf-495c-9ff3-055ebf32e3a6",
                origin: "https://test.com",
                code: "ZFsXf",
                total_redirects: 1,
                created_at: "2024-08-11T19:37:54.286Z",
                updated_at: "2024-08-11T20:19:09.182Z",
                deleted_at: null,
                user_owner_id: "193bbca0-0794-4d05-b999-7b3b4be68847",
            },
        });

        const { success } = await mockUrlUpdateByIdUseCase.execute(UrlUpdateByIdDTO);

        expect(success).toBeTruthy();
    });
});
