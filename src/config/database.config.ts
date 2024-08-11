import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: ["query", "info", "warn", "error"],
            errorFormat: "minimal",
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on("beforeExit", async () => {
            await app.close();
        });
    }
}
