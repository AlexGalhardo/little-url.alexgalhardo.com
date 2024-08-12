import { Controller, Post, Res, Body, Inject, HttpStatus, Get, Req, Delete, Patch, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import UrlCreateUseCase, { UrlCreateUseCaseDTO } from "src/use-cases/url-create.use-case";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";
import * as jwt from "jsonwebtoken";
import UrlListAllByUserUseCase from "src/use-cases/url-list-all-by-user.use-case";
import UrlUpdateByIdUseCase, { UrlUpdateByIdUseCaseDTO } from "src/use-cases/url-update-by-id.use-case";
import UrlDeleteByIdUseCase from "src/use-cases/url-delete-by-id.use-case";
import { ErrorsMessages } from "src/utils/errors-messages.util";
import VerifyJwtTokenUseCase from "src/use-cases/verify-jwt-token.use-case";
import TelegramLog from "src/config/telegram-logger.config";
import { SwaggerUrlCreateBodyDTO } from "src/swagger/url-create.swagger";
import { SwaggerUrlResponse } from "src/swagger/url-response.swagger";
import { SwaggerUrlUpdateBodyDTO } from "src/swagger/url-update.swagger";

interface UrlControllerPort {
    createUrl(
        createUrlPayload: UrlCreateUseCaseDTO,
        request: Request,
        response: Response,
    ): Promise<Response<SwaggerUrlResponse>>;
    redirect(code: string, response: Response);
}

@Controller()
@ApiTags("api")
export class UrlController implements UrlControllerPort {
    constructor(
        @Inject("UrlCreateUseCasePort") private readonly urlCreateUseCase: UrlCreateUseCase,
        @Inject("UrlRedirectUseCasePort") private readonly urlRedirectUseCase: UrlRedirectUseCase,
        @Inject("UrlListAllByUserUseCasePort") private readonly urlListAllByUserUseCase: UrlListAllByUserUseCase,
        @Inject("UrlUpdateByIdUseCasePort") private readonly urlUpdateByIdUseCase: UrlUpdateByIdUseCase,
        @Inject("UrlDeleteByIdUseCasePort") private readonly urlDeleteByIdUseCase: UrlDeleteByIdUseCase,
        @Inject("VerifyJwtTokenUseCasePort") private readonly verifyJwtTokenUseCase: VerifyJwtTokenUseCase,
    ) {}

    private async verifyJwtToken(request: Request): Promise<string | null> {
        if (
            request.headers?.authorization &&
            request.headers.authorization.startsWith("Bearer") &&
            request.headers.authorization.split(" ")[1]
        ) {
            const jwtToken = request.headers.authorization.split(" ")[1];

            try {
                await this.verifyJwtTokenUseCase.execute(jwtToken);

                const { userId } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

                return userId;
            } catch (error) {
                throw new Error(error.message);
            }
        }
        return null;
    }

    @Post("/urls")
    @ApiBearerAuth()
    @ApiHeader({
        name: "Authorization",
        description: "Optional Bearer token for user identification",
        required: false,
    })
    @ApiBody({ type: SwaggerUrlCreateBodyDTO })
    @ApiResponse({ status: 201, type: SwaggerUrlResponse })
    async createUrl(
        @Body() createUrlPayload: UrlCreateUseCaseDTO,
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<Response<SwaggerUrlResponse>> {
        try {
            const userId = await this.verifyJwtToken(request);
            const { data } = await this.urlCreateUseCase.execute(createUrlPayload, userId);
            return response.status(HttpStatus.CREATED).json({ success: true, data });
        } catch (error: any) {
            TelegramLog.error(`ERROR createUrl: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Get("/urls")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: SwaggerUrlResponse })
    async listAllUrlsByUser(@Res() response: Response): Promise<Response<SwaggerUrlResponse>> {
        try {
            const { userId } = response.locals;
            const { success, data } = await this.urlListAllByUserUseCase.execute({ userId });
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, error: ErrorsMessages.USER_NOT_FOUND });
        } catch (error: any) {
            TelegramLog.error(`ERROR listAllUrlsByUser: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Patch("/urls/:id")
    @ApiBearerAuth()
    @ApiParam({
        name: "id",
        description: "Url id",
        example: "9ee05676-4ab4-492f-ba97-12ddbe32a127",
        required: true,
        type: String,
    })
    @ApiBody({ type: SwaggerUrlUpdateBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerUrlResponse })
    async updateUrl(
        @Body() updateUrlPayload: UrlUpdateByIdUseCaseDTO,
        @Param("id") id: string,
        @Res() response: Response,
    ): Promise<Response<SwaggerUrlResponse>> {
        try {
            const { success, data } = await this.urlUpdateByIdUseCase.execute({ id, ...updateUrlPayload });
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: "Url id not found" });
        } catch (error: any) {
            TelegramLog.error(`ERROR updateUrl: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Delete("/urls/:id")
    @ApiBearerAuth()
    @ApiParam({
        name: "id",
        description: "Url Id",
        example: "9ee05676-4ab4-492f-ba97-12ddbe32a127",
        required: true,
        type: String,
    })
    @ApiResponse({ status: 200, type: SwaggerUrlResponse })
    async deleteUrl(@Param("id") id: string, @Res() response: Response): Promise<Response<SwaggerUrlResponse>> {
        try {
            const { success } = await this.urlDeleteByIdUseCase.execute({ id });
            if (success) return response.status(HttpStatus.OK).json({ success: true });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: "Url id not found" });
        } catch (error: any) {
            TelegramLog.error(`ERROR deleteUrl: ${error.message}`); // DataDog, Sentry, etc here
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    @Get("/:code")
    @ApiParam({
        name: "code",
        description: "The shortened URL code",
        example: "4mAFa",
        required: true,
        type: String,
    })
    @ApiResponse({ status: 200, type: SwaggerUrlResponse })
    async redirect(@Param("code") code: string, @Res() response: Response) {
        try {
            const { success, redirect } = await this.urlRedirectUseCase.execute({ code });
            if (success) return response.redirect(redirect);
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: "Url code not found" });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
}
