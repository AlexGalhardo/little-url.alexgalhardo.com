import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { Urls } from "@prisma/client";
import { randomUUID } from "crypto";

interface UrlCreateRepositoryDTO {
    origin: string;
    code: string;
    user_owner_id: string | null;
}

interface UrlUpdateRepositoryDTO {
    id: string;
    origin: string;
}

export interface UrlsRepositoryPort {
    alreadyCreated(url: string): Promise<Urls>;
    findByCode(code: string): Promise<Urls>;
    incrementTotalRedirects(code: string): Promise<Urls>;
    create({ origin, code }: UrlCreateRepositoryDTO): Promise<Urls>;
    findById(id: string): Promise<Urls>;
    deleteById(id: string): Promise<Urls>;
    updateOrigin({ id, origin }: UrlUpdateRepositoryDTO): Promise<Urls>;
    findByUserId(userId: string): Promise<Urls[]>;
}

@Injectable()
export default class UrlsRepository implements UrlsRepositoryPort {
    constructor(private readonly database: Database) {}
    public async findById(id: string): Promise<Urls> {
        try {
            return await this.database.urls.findUnique({
                where: {
                    id,
                    deleted_at: null,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async findByUserId(userId: string): Promise<Urls[]> {
        try {
            return await this.database.urls.findMany({
                where: {
                    user_owner_id: userId,
                    deleted_at: null,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async alreadyCreated(url: string): Promise<Urls> {
        try {
            return await this.database.urls.findUnique({
                where: {
                    origin: url,
                    deleted_at: null,
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
                    deleted_at: null,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async incrementTotalRedirects(code: string): Promise<Urls> {
        try {
            return await this.database.urls.update({
                where: {
                    code,
                    deleted_at: null,
                },
                data: {
                    total_redirects: {
                        increment: 1,
                    },
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async create({ origin, code, user_owner_id }: UrlCreateRepositoryDTO): Promise<Urls> {
        try {
            return await this.database.urls.create({
                data: {
                    id: randomUUID(),
                    origin,
                    code,
                    total_redirects: 0,
                    user_owner_id,
                    created_at: new Date(),
                    updated_at: null,
                    deleted_at: null,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updateOrigin({ id, origin }: UrlUpdateRepositoryDTO): Promise<Urls> {
        try {
            return await this.database.urls.update({
                where: {
                    id,
                    deleted_at: null,
                },
                data: {
                    origin,
                    updated_at: new Date(),
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteById(id: string): Promise<Urls> {
        try {
            return await this.database.urls.update({
                where: {
                    id,
                    deleted_at: null,
                },
                data: {
                    deleted_at: new Date(),
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
