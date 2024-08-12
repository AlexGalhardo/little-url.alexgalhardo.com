import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ENABLE_DATABASE_DEBUG } from "src/utils/constants.util";

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
    constructor() {
        if (ENABLE_DATABASE_DEBUG) {
            super({
                log: ["query", "info", "warn", "error"],
                errorFormat: "minimal",
            });
        }
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
