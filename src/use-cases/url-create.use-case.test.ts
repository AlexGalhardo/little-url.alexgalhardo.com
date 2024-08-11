import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import { UrlCreateUseCaseDTO, UrlCreateUseCasePort } from "./url-create.use-case";

describe("Test Url Create Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UrlsRepositoryPort", useValue: mock<UrlsRepositoryPort>() },
                { provide: "UrlCreateUseCasePort", useValue: mock<UrlCreateUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create url", async () => {
        const UrlCreateDTO = mock<UrlCreateUseCaseDTO>();

        const mockUrlCreateUseCase = mock<UrlCreateUseCasePort>();

        mockUrlCreateUseCase.execute.mockResolvedValueOnce({
            success: true,
            data: { origin: "test", shortened_url: "test" },
        });

        const { success, data } = await mockUrlCreateUseCase.execute(UrlCreateDTO, "user-id");

        expect(success).toBeTruthy();
        expect(data).toBeDefined();
    });
});
