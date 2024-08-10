import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth.module";
import { HealthCheckModule } from "./modules/health-check.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateToken } from "./middlewares/validate-token.middleware";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { UrlModule } from "./modules/url.module";

@Module({
    imports: [
        HealthCheckModule,
        AuthModule,
        UrlModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000, // milliseconds
                limit: 1, // 1 request each ttl
            },
        ]),
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateToken)
            .forRoutes(
                { path: "/check-user-jwt-token", method: RequestMethod.POST },
                { path: "/logout", method: RequestMethod.POST },
            );
    }
}
