import { ApiProperty } from "@nestjs/swagger";

export class SwaggerAuthLoginDTO {
    @ApiProperty({ example: "john.doe@example.com", description: "The email address of the user" })
    email: string;

    @ApiProperty({ example: "strongPassword!123", description: "The password for the user account" })
    password: string;
}
