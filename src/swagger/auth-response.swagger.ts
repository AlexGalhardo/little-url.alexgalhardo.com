import { ApiProperty } from "@nestjs/swagger";

export class SwaggerAuthResponse {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    jwt_token?: string;

    @ApiProperty()
    message?: string;

    @ApiProperty()
    redirect?: string;
}
