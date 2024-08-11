import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import { UrlListAllByUserUseCaseDTO, UrlListAllByUserUseCasePort } from "./url-list-all-by-user.use-case";

describe("Test List All Urls By User Id Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UrlsRepositoryPort", useValue: mock<UrlsRepositoryPort>() },
                { provide: "UrlListAllByUserUseCasePort", useValue: mock<UrlListAllByUserUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should list all not deleted urls created by user", async () => {
        const UrlListAllByUserDTO = mock<UrlListAllByUserUseCaseDTO>();

        const mockUrlListAllByUserUseCase = mock<UrlListAllByUserUseCasePort>();

        mockUrlListAllByUserUseCase.execute.mockResolvedValueOnce({
            success: true,
            data: [
                {
                    id: "4a3d8077-e7bf-495c-9ff3-055ebf32e3a6",
                    origin: "https://microsoft.com",
                    code: "ZFsXf",
                    total_redirects: 1,
                    created_at: new Date("2024-08-11T19:37:54.286Z"),
                    updated_at: new Date("2024-08-11T19:38:10.629Z"),
                    deleted_at: null,
                    user_owner_id: "193bbca0-0794-4d05-b999-7b3b4be68847",
                },
                {
                    id: "4a3d8077-e7bf-495c-9ff3-055ebf32e3b7",
                    origin: "https://chatgpt.com",
                    code: "kaYis",
                    total_redirects: 3,
                    created_at: new Date("2024-08-11T19:37:54.286Z"),
                    updated_at: new Date("2024-08-11T19:38:10.629Z"),
                    deleted_at: null,
                    user_owner_id: "193bbca0-0794-4d05-b999-7b3b4be68847",
                },
            ],
        });

        const { success, data } = await mockUrlListAllByUserUseCase.execute(UrlListAllByUserDTO);

        expect(success).toBeTruthy();
        expect(data.length).toBe(2);
    });
});
