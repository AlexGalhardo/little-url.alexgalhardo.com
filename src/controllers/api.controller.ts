import { Controller, Post, Res, Body, Inject, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

interface APIControllerPort {}

@Controller()
@ApiTags("api")
export class ContactController implements APIControllerPort {
    constructor() {}

    @Post("/url")
    // @ApiResponse({ status: 200, type: Contact })
    async contactSendMessage() {}
}
