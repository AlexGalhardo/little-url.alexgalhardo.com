import { ApiProperty } from "@nestjs/swagger";

export class Url {
    @ApiProperty({ example: "https://google.com", description: "Url to be shortened" })
    url: string;
}
