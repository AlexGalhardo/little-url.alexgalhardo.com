import { UrlsRepositoryPort } from "src/repositories/urls.repository";

interface UrlDeleteByIdUseCaseResponse {
    success: boolean;
}

export interface UrlDeleteByIdUseCaseDTO {
    id: string;
}

export interface UrlDeleteByIdUseCasePort {
    execute(urlDeleteByIdPayload: UrlDeleteByIdUseCaseDTO): Promise<UrlDeleteByIdUseCaseResponse>;
}

export default class UrlDeleteByIdUseCase implements UrlDeleteByIdUseCasePort {
    constructor(private readonly urlsRepository: UrlsRepositoryPort) {}

    async execute(urlDeleteByIdPayload: UrlDeleteByIdUseCaseDTO): Promise<UrlDeleteByIdUseCaseResponse> {
        try {
            const urlDeleted = await this.urlsRepository.deleteById(urlDeleteByIdPayload.id);

            if (urlDeleted.deleted_at) return { success: true };

            return { success: false };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
