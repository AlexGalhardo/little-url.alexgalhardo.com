import { ApiProperty } from "@nestjs/swagger";

export class Auth {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    jwt_token?: string;

    @ApiProperty()
    message?: string;

    @ApiProperty()
    redirect?: string;
}
