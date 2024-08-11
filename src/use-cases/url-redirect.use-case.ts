import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import validateUrlCodeSchema from "src/validators/url-code.validator";

interface UrlRedirectUseCaseResponse {
    success: boolean;
    redirect?: string;
}

export interface UrlRedirectUseCaseDTO {
    code: string;
}

export interface UrlRedirectUseCasePort {
    execute(urlRedirectPayload: UrlRedirectUseCaseDTO): Promise<UrlRedirectUseCaseResponse>;
}

export default class UrlRedirectUseCase implements UrlRedirectUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlRedirectPayload: UrlRedirectUseCaseDTO): Promise<UrlRedirectUseCaseResponse> {
        try {
            validateUrlCodeSchema.parse(urlRedirectPayload);

            const urlCodeFound = await this.urlsRepository.findByCode(urlRedirectPayload.code);

            if (urlCodeFound) {
                await this.urlsRepository.incrementTotalRedirects(urlRedirectPayload.code);
                return { success: true, redirect: urlCodeFound.origin };
            }

            return { success: false };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
