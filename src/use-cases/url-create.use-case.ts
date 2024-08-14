import generateRandomToken from "src/utils/generate-random-token.util";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";
import { APP_URL } from "src/utils/constants.util";
import UrlValidator from "src/validators/url.validator";
import { ErrorsMessages } from "src/utils/errors-messages.util";

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
    execute(urlCreatePayload: UrlCreateUseCaseDTO, userJwtToken: string): Promise<UrlCreateUseCaseResponse>;
}

export default class UrlCreateUseCase implements UrlCreateUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlCreatePayload: UrlCreateUseCaseDTO, userId: string | null): Promise<UrlCreateUseCaseResponse> {
        try {
            UrlValidator.parse(urlCreatePayload);

            try {
                await fetch(urlCreatePayload.url);
            } catch (error) {
                throw new Error(ErrorsMessages.INVALID_URL_DOMAIN);
            }

            const urlAlreadyCreated = await this.urlsRepository.alreadyCreated(urlCreatePayload.url);

            if (!urlAlreadyCreated) {
                const code = generateRandomToken();

                await this.urlsRepository.create({
                    origin: urlCreatePayload.url,
                    code,
                    user_owner_id: userId,
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
