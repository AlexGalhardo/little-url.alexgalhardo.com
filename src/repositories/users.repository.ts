import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { Users } from "@prisma/client";

interface UserCreateRepositoryDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    jwt_token: string;
    created_at: Date;
}

export interface UsersRepositoryPort {
    findByEmail(email: string): Promise<Users>;
    findById(userId: string): Promise<Users>;
    create(user: UserCreateRepositoryDTO): Promise<Users>;
    logout(userId: string): Promise<void>;
    updateJwtToken(userId: string, jwtToken: string): Promise<void>;
    findByJwtToken(jwtToken: string): Promise<Users>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
    constructor(private readonly database: Database) {}

    public async findByEmail(email: string) {
        try {
            return await this.database.users.findUnique({
                where: {
                    email,
                },
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async findByJwtToken(jwtToken: string): Promise<Users> {
        try {
            return await this.database.users.findUnique({
                where: {
                    jwt_token: jwtToken,
                },
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async findById(id: string) {
        try {
            return await this.database.users.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async create(user: Users): Promise<Users> {
        try {
            return await this.database.users.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    jwt_token: user.jwt_token,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async logout(userId: string): Promise<void> {
        try {
            await this.database.users.update({
                where: {
                    id: userId,
                },
                data: {
                    jwt_token: null,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateJwtToken(userId: string, jwtToken: string): Promise<void> {
        try {
            await this.database.users.update({
                where: {
                    id: userId,
                },
                data: {
                    jwt_token: jwtToken,
                    updated_at: new Date(),
                },
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }
}
