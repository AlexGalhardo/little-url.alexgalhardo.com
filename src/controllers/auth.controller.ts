import { Controller, Post, Res, Body, Inject, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import TelegramLog from "../config/telegram-logger.config";
import { SwaggerAuthCreateAccountBodyDTO } from "src/swagger/auth-create-account.swagger";
import { SwaggerAuthResponse } from "src/swagger/auth-response.swagger";
import { AuthCreateAccountUseCasePort } from "src/use-cases/auth-create-account.use-case";
import { SwaggerAuthLoginBodyDTO } from "src/swagger/auth-login.swagger";

interface AuthUseCaseResponse {
    success: boolean;
    jwt_token?: string;
    message?: string;
    redirect?: string;
}

interface AuthControllerPort {
    login(authLoginDTO: AuthLoginDTO, response: Response): Promise<Response<AuthUseCaseResponse>>;
    createAccount(
        AuthCreateAccountDTO: SwaggerAuthCreateAccountBodyDTO,
        response: Response,
    ): Promise<Response<AuthUseCaseResponse>>;
    logout(response: Response): Promise<Response<AuthUseCaseResponse>>;
}

@ApiTags("auth")
@Controller("/auth")
export class AuthController implements AuthControllerPort {
    constructor(
        @Inject("AuthLoginUseCasePort") private readonly authLoginUseCase: AuthLoginUseCasePort,
        @Inject("AuthCreateAccountUseCasePort") private readonly AuthCreateAccountUseCase: AuthCreateAccountUseCasePort,
        @Inject("AuthLogoutUseCasePort") private readonly authLogoutUseCase: AuthLogoutUseCasePort,
    ) {}

    @Post("/login")
    @ApiBody({ type: SwaggerAuthLoginBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async login(
        @Body() authLoginPayload: AuthLoginDTO,
        @Res() response: Response,
    ): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { success, jwt_token, error } = await this.authLoginUseCase.execute(authLoginPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, jwt_token });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error });
        } catch (error: any) {
            TelegramLog.error(`ERROR Auth Login: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Post("/create-account")
    @ApiBody({ type: SwaggerAuthCreateAccountBodyDTO })
    @ApiResponse({ status: 201, type: SwaggerAuthResponse })
    async createAccount(
        @Body() AuthCreateAccountPayload: SwaggerAuthCreateAccountBodyDTO,
        @Res() response: Response,
    ): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { success, jwt_token } = await this.AuthCreateAccountUseCase.execute(AuthCreateAccountPayload);
            if (success === true) return response.status(HttpStatus.CREATED).json({ success: true, jwt_token });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
        } catch (error: any) {
            TelegramLog.error(`ERROR Auth Create Account: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Post("/logout")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async logout(@Res() response: Response): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { userId } = response.locals;
            const { success } = await this.authLogoutUseCase.execute(userId);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
        } catch (error: any) {
            TelegramLog.error(`ERROR Auth Logout: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
}
