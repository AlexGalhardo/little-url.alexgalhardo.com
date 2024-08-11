import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth.module";
import { HealthCheckModule } from "./modules/health-check.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateHeaderAuthorizationBearerJWTToken } from "./middlewares/validate-header-authorization-bearer-jwt-token.middleware";
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
            .apply(ValidateHeaderAuthorizationBearerJWTToken)
            .forRoutes(
                { path: "/auth/logout", method: RequestMethod.POST },
                { path: "/urls", method: RequestMethod.GET },
                { path: "/urls/:id", method: RequestMethod.PATCH },
                { path: "/urls/:id", method: RequestMethod.DELETE },
            );
    }
}
