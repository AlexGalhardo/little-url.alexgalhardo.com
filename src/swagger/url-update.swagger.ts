import { ApiProperty } from "@nestjs/swagger";

export class SwaggerUrlUpdateBodyDTO {
    @ApiProperty({ example: "https://chatgpt.com", description: "Origin URL Domain to update" })
    origin: string;
}
