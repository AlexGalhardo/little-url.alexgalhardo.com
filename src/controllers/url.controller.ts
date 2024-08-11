import { Controller, Post, Res, Body, Inject, HttpStatus, Get, Req, Delete, Patch } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import UrlCreateUseCase, { UrlCreateUseCaseDTO } from "src/use-cases/url-create.use-case";
import { Url } from "../entities/url.entity";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";
import * as jwt from "jsonwebtoken";
import UrlListAllByUserUseCase from "src/use-cases/url-list-all-by-user.use-case";
import UrlUpdateByIdUseCase, { UrlUpdateByIdUseCaseDTO } from "src/use-cases/url-update-by-id.use-case";
import UrlDeleteByIdUseCase from "src/use-cases/url-delete-by-id.use-case";
import { ErrorsMessages } from "src/utils/errors-messages.util";
import VerifyJwtTokenUseCase from "src/use-cases/verify-jwt-token.use-case";

interface UrlUseCaseResponse {
    success: boolean;
    data?: Url;
    redirect?: string;
}

interface UrlControllerPort {
    createUrl(
        createUrlPayload: UrlCreateUseCaseDTO,
        request: Request,
        response: Response,
    ): Promise<Response<UrlUseCaseResponse>>;
    redirect(request: Request, response: Response): Promise<Response<UrlUseCaseResponse>>;
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

            console.log("jwtToken => ", jwtToken);

            try {
                await this.verifyJwtTokenUseCase.execute(jwtToken);

                const { userId } = jwt.verify(jwtToken, process.env.JWT_SECRET) as jwt.JwtPayload;

                console.log("userId => ", userId);

                return userId;
            } catch (error) {
                throw new Error(error.message);
            }
        }
        return null;
    }

    @Post("/urls")
    @ApiResponse({ status: 200, type: Url })
    async createUrl(
        @Body() createUrlPayload: UrlCreateUseCaseDTO,
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<Response<UrlUseCaseResponse>> {
        try {
            const userId = await this.verifyJwtToken(request);
            const { data } = await this.urlCreateUseCase.execute(createUrlPayload, userId);
            return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Get("/urls")
    @ApiResponse({ status: 200, type: Url })
    async listAllUrlsByUser(@Res() response: Response): Promise<Response<UrlUseCaseResponse>> {
        try {
            const { userId } = response.locals;
            const { success, data } = await this.urlListAllByUserUseCase.execute({ userId });
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: ErrorsMessages.USER_NOT_FOUND });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Patch("/urls/:id")
    @ApiResponse({ status: 200, type: Url })
    async updateUrl(
        @Body() updateUrlPayload: UrlUpdateByIdUseCaseDTO,
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<Response<UrlUseCaseResponse>> {
        try {
            const { id } = request.params;
            const { success, data } = await this.urlUpdateByIdUseCase.execute({ id, ...updateUrlPayload });
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Url code not found" });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Delete("/urls/:id")
    @ApiResponse({ status: 200, type: Url })
    async deleteUrl(@Req() request: Request, @Res() response: Response): Promise<Response<UrlUseCaseResponse>> {
        try {
            const { id } = request.params;
            const { success } = await this.urlDeleteByIdUseCase.execute({ id });
            if (success) return response.status(HttpStatus.OK).json({ success: true });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Url not found" });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    @Get("/:code")
    @ApiResponse({ status: 200, type: Url })
    async redirect(@Req() request: Request, @Res() response: Response): Promise<Response<UrlUseCaseResponse>> {
        try {
            const { code } = request.params;
            const { success, redirect } = await this.urlRedirectUseCase.execute({ code });
            if (success) response.redirect(redirect);
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Url code not found" });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
