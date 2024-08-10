import { ApiProperty } from "@nestjs/swagger";

export class HealthCheck {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;
}
