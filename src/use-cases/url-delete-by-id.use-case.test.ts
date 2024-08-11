import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import { UrlDeleteByIdUseCaseDTO, UrlDeleteByIdUseCasePort } from "./url-delete-by-id.use-case";

describe("Test Url Delete Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UrlsRepositoryPort", useValue: mock<UrlsRepositoryPort>() },
                { provide: "UrlDeleteByIdUseCasePort", useValue: mock<UrlDeleteByIdUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete url by id", async () => {
        const UrlDeleteByIdDTO = mock<UrlDeleteByIdUseCaseDTO>();
        const mockUrlDeleteByIdUseCase = mock<UrlDeleteByIdUseCasePort>();
        mockUrlDeleteByIdUseCase.execute.mockResolvedValueOnce({ success: true });
        const { success } = await mockUrlDeleteByIdUseCase.execute(UrlDeleteByIdDTO);

        expect(success).toBeTruthy();
    });
});
