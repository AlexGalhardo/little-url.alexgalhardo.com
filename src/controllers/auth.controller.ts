import { Controller, Post, Res, Body, Inject, HttpStatus, Req, Get } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { AuthRegisterDTO, AuthRegisterUseCasePort } from "../use-cases/auth-register.use-case";
import { AuthCheckUserJWTTokenUseCasePort } from "../use-cases/auth-check-user-jwt-token.use-case";
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
    register(authRegisterDTO: AuthRegisterDTO, response: Response): Promise<Response<AuthUseCaseResponse>>;
    logout(response: Response): Promise<Response<AuthUseCaseResponse>>;
}

@ApiTags("auth")
@Controller()
export class AuthController implements AuthControllerPort {
    constructor(
        @Inject("AuthLoginUseCasePort") private readonly authLoginUseCase: AuthLoginUseCasePort,
        @Inject("AuthRegisterUseCasePort") private readonly authRegisterUseCase: AuthRegisterUseCasePort,
        @Inject("AuthLogoutUseCasePort") private readonly authLogoutUseCase: AuthLogoutUseCasePort,
        @Inject("AuthCheckUserJWTTokenUseCasePort")
        private readonly authCheckUserJWTTokenUseCase: AuthCheckUserJWTTokenUseCasePort,
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

    @Post("/register")
    @ApiResponse({ status: 201, type: Auth })
    async register(
        @Body() authRegisterPayload: AuthRegisterDTO,
        @Res() response: Response,
    ): Promise<Response<AuthUseCaseResponse>> {
        try {
            const { success, jwt_token } = await this.authRegisterUseCase.execute(authRegisterPayload);
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
            const userJWTToken = response.locals.token;
            const { success } = await this.authLogoutUseCase.execute(userJWTToken);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Post("/check-user-jwt-token")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: Auth })
    async tokenUser(@Res() response: Response): Promise<Response<AuthUseCaseResponse>> {
        try {
            const userJWTToken = response.locals.token;
            const { success, data } = await this.authCheckUserJWTTokenUseCase.execute(userJWTToken);
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
