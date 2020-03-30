// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        required: false,
        example: 'demo@demo.com',
    })
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty({
        required: false,
        example: 'demo_user',
    })
    @IsOptional()
    username: string

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    password: string
}
