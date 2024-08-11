import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import { UrlRedirectUseCaseDTO, UrlRedirectUseCasePort } from "./url-redirect.use-case";

describe("Test Url Redirect Use Case", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UrlsRepositoryPort", useValue: mock<UrlsRepositoryPort>() },
                { provide: "UrlRedirectUseCasePort", useValue: mock<UrlRedirectUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to origin url using shortened url code", async () => {
        const UrlRedirectDTO = mock<UrlRedirectUseCaseDTO>();

        const mockUrlRedirectUseCase = mock<UrlRedirectUseCasePort>();

        mockUrlRedirectUseCase.execute.mockResolvedValueOnce({ success: true, redirect: "https://google.com" });

        const { success, redirect } = await mockUrlRedirectUseCase.execute(UrlRedirectDTO);

        expect(success).toBeTruthy();
        expect(redirect).toBe("https://google.com");
    });
});
