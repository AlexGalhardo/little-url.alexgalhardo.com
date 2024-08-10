import GenerateRandomToken from "src/utils/generate-random-token.util";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import APP_URL from "src/utils/constants.util";
import validateUrlSchema from "src/validators/url.validator";

interface UrlCreateUseCaseResponse {
    success: boolean;
    data: {
        origin: string;
        shortened_url: string;
    };
}

export interface UrlCreateUseCaseDTO {
    url: string;
}

export interface UrlCreateUseCasePort {
    execute(urlCreatePayload: UrlCreateUseCaseDTO): Promise<UrlCreateUseCaseResponse>;
}

export default class UrlCreateUseCase implements UrlCreateUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlCreatePayload: UrlCreateUseCaseDTO): Promise<UrlCreateUseCaseResponse> {
        try {
            validateUrlSchema.parse(urlCreatePayload);

            const urlAlreadyCreated = await this.urlsRepository.alreadyCreated(urlCreatePayload.url);

            if (!urlAlreadyCreated) {
                const code = GenerateRandomToken();

                await this.urlsRepository.create({
                    origin: urlCreatePayload.url,
                    code,
                });

                return { success: true, data: { origin: urlCreatePayload.url, shortened_url: `${APP_URL}/${code}` } };
            }

            return {
                success: true,
                data: { origin: urlCreatePayload.url, shortened_url: `${APP_URL}/${urlAlreadyCreated.code}` },
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
