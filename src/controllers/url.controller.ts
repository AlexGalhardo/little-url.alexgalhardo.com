import { Controller, Post, Res, Body, Inject, HttpStatus, Get, Req, Delete, Patch } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import UrlCreateUseCase, { UrlCreateUseCaseDTO } from "src/use-cases/url-create-use-case";
import { Url } from "../entities/url.entity";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";
import * as jwt from "jsonwebtoken";
import UrlListAllByUserUseCase from "src/use-cases/url-list-all-by-user.use-case";
import UrlUpdateByIdUseCase, { UrlUpdateByIdUseCaseDTO } from "src/use-cases/url-update-by-id.use-case";
import UrlDeleteByIdUseCase from "src/use-cases/url-delete-by-id.use-case";
import { ErrorsMessages } from "src/utils/errors-messages.util";

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
    ) {}

    @Post("/urls")
    @ApiResponse({ status: 200, type: Url })
    async createUrl(
        @Body() createUrlPayload: UrlCreateUseCaseDTO,
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<Response<UrlUseCaseResponse>> {
        try {
            let idUser = null;
            if (
                request.headers?.authorization &&
                request.headers.authorization.startsWith("Bearer") &&
                request.headers.authorization.split(" ")[1]
            ) {
                const token = request.headers.authorization.split(" ")[1];

                const { userId } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

                idUser = userId;
            }
            // if (response.locals.userId) userId = response.locals.userId;
            const { data } = await this.urlCreateUseCase.execute(createUrlPayload, idUser);
            return response.status(HttpStatus.OK).json({ success: true, data });
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

    @Get("/urls")
    @ApiResponse({ status: 200, type: Url })
    async listAllUrlsByUser(@Req() request: Request, @Res() response: Response): Promise<Response<UrlUseCaseResponse>> {
        try {
            const userId = response.locals.userId;
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
}
