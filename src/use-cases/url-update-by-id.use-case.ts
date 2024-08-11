import { UrlsRepositoryPort } from "src/repositories/urls.repository";

interface UrlUpdateByIdUseCaseResponse {
    success: boolean;
    data?: any;
}

export interface UrlUpdateByIdUseCaseDTO {
    id: string;
    origin: string;
}

export interface UrlUpdateByIdUseCasePort {
    execute(urlUpdateByIdPayload: UrlUpdateByIdUseCaseDTO): Promise<UrlUpdateByIdUseCaseResponse>;
}

export default class UrlUpdateByIdUseCase implements UrlUpdateByIdUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlUpdateByIdPayload: UrlUpdateByIdUseCaseDTO): Promise<UrlUpdateByIdUseCaseResponse> {
        try {
            const urlExists = await this.urlsRepository.findById(urlUpdateByIdPayload.id);

            if (urlExists) {
                const urlUpdated = await this.urlsRepository.updateOrigin(urlUpdateByIdPayload);
                return { success: true, data: { ...urlUpdated } };
            }

            return { success: false };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
