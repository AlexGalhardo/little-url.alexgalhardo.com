import { Controller, Post, Res, Body, Inject, HttpStatus, Get, Req } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import UrlCreateUseCase, { UrlCreateUseCaseDTO } from "src/use-cases/url-create-use-case";
import { Url } from "../entities/url.entity";
import UrlRedirectUseCase from "src/use-cases/url-redirect.use-case";

interface UrlUseCaseResponse {
    success: boolean;
    data?: Url;
    redirect?: string;
}

interface UrlControllerPort {
    createURL(createUrlPayload: UrlCreateUseCaseDTO, response: Response): Promise<Response<UrlUseCaseResponse>>;
    redirect(request: Request, response: Response): Promise<Response<UrlUseCaseResponse>>;
}

@Controller()
@ApiTags("api")
export class UrlController implements UrlControllerPort {
    constructor(
        @Inject("UrlCreateUseCasePort") private readonly urlCreateUseCase: UrlCreateUseCase,
        @Inject("UrlRedirectUseCasePort") private readonly urlRedirectUseCase: UrlRedirectUseCase,
    ) {}

    @Post("/url")
    @ApiResponse({ status: 200, type: Url })
    async createURL(
        @Body() createUrlPayload: UrlCreateUseCaseDTO,
        @Res() response: Response,
    ): Promise<Response<UrlUseCaseResponse>> {
        try {
            const { data } = await this.urlCreateUseCase.execute(createUrlPayload);
            return response.status(HttpStatus.OK).json({ success: true, data });
        } catch (error: any) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: JSON.parse(error.message) });
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
