import { Controller, Post, Res, Body, Inject, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { AuthCreateAccountDTO, AuthCreateAccountUseCasePort } from "../use-cases/auth-create-account.use-case";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Auth } from "../entities/auth.entity";

interface AuthUseCaseResponse {
    success: boolean;
    jwt_token?: string;
    message?: string;
    redirect?: string;
}

interface AuthControllerPort {
    login(authLoginDTO: AuthLoginDTO, response: Response): Promise<Response<AuthUseCaseResponse>>;
    createAccount(
        AuthCreateAccountDTO: AuthCreateAccountDTO,
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
    @ApiResponse({ status: 200, type: Auth })
    async login(
        @Body() authLoginPayload: AuthLoginDTO,
        @Res() response: Response,
    ): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { success, jwt_token, message } = await this.authLoginUseCase.execute(authLoginPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, jwt_token });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/create-account")
    @ApiResponse({ status: 201, type: Auth })
    async createAccount(
        @Body() AuthCreateAccountPayload: AuthCreateAccountDTO,
        @Res() response: Response,
    ): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { success, jwt_token } = await this.AuthCreateAccountUseCase.execute(AuthCreateAccountPayload);
            if (success === true) return response.status(HttpStatus.OK).json({ success: true, jwt_token });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/logout")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: Auth })
    async logout(@Res() response: Response): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { userId } = response.locals;
            const { success } = await this.authLogoutUseCase.execute(userId);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
