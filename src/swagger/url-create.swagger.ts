import { ApiProperty } from "@nestjs/swagger";

export class SwaggerUrlCreateBodyDTO {
    @ApiProperty({ example: "https://google.com", description: "Origin URL Domain" })
    url: string;
}
