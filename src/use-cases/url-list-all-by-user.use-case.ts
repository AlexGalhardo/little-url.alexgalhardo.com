import { Urls } from "@prisma/client";
import { UrlsRepositoryPort } from "src/repositories/urls.repository";

interface UrlListAllByUserUseCaseResponse {
    success: boolean;
    data?: Urls[];
}

export interface UrlListAllByUserUseCaseDTO {
    userId: string;
}

export interface UrlListAllByUserUseCasePort {
    execute(urlListAllByUserPayload: UrlListAllByUserUseCaseDTO): Promise<UrlListAllByUserUseCaseResponse>;
}

export default class UrlListAllByUserUseCase implements UrlListAllByUserUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlListAllByUserPayload: UrlListAllByUserUseCaseDTO): Promise<UrlListAllByUserUseCaseResponse> {
        try {
            const urlsFound = await this.urlsRepository.findByUserId(urlListAllByUserPayload.userId);

            if (urlsFound) {
                return { success: true, data: urlsFound };
            }

            return { success: false };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
