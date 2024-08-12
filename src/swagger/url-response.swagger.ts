import { ApiProperty } from "@nestjs/swagger";

export class SwaggerUrlResponse {
    @ApiProperty({ example: "https://google.com", description: "Url domain to be redirected" })
    redirect: string;
}
