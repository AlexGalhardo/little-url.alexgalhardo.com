import { ApiProperty } from "@nestjs/swagger";

export class SwaggerUrlIdParamDTO {
    @ApiProperty({ example: "5709da4f-e3e2-4609-962b-8106d373230d", description: "Url id" })
    id: string;
}
