import { Bcrypt } from "../utils/bcrypt.util";
import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";

export interface UserUpdated {
    username: string;
    email?: string;
}

export interface UsersRepositoryPort {
    findByEmail(email: string);
    findById(userId: string);
    create(user): Promise<void>;
    logout(userId: string): Promise<void>;
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

    public async create(user): Promise<void> {
        await this.database.users.create({
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
    }

    public async logout(userId: string): Promise<void> {
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }
}
