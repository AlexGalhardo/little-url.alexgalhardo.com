import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { Urls } from "@prisma/client";
import { randomUUID } from "crypto";

interface UrlCreateRepositoryDTO {
    origin: string;
    code: string;
}

export interface UrlsRepositoryPort {
    alreadyCreated(url: string): Promise<Urls>;
    findByCode(code: string): Promise<Urls>;
    create({ origin, code }: UrlCreateRepositoryDTO): Promise<Urls>;
}

@Injectable()
export default class UrlsRepository implements UrlsRepositoryPort {
    constructor(private readonly database: Database) {}

    public async alreadyCreated(url: string): Promise<Urls> {
        try {
            return await this.database.urls.findUnique({
                where: {
                    origin: url,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async findByCode(code: string): Promise<Urls> {
        try {
            return await this.database.urls.findUnique({
                where: {
                    code,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async create({ origin, code }: UrlCreateRepositoryDTO): Promise<Urls> {
        try {
            return await this.database.urls.create({
                data: {
                    id: randomUUID(),
                    origin,
                    code,
                    total_redirects: 0,
                    created_at: new Date(),
                    updated_at: null,
                    deleted_at: null,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
