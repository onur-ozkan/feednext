import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class LoginDto {
    @ApiModelProperty({
        required: false,
        example: 'example@gmail.com',
    })
    @IsOptional()
    @IsEmail()
    email: string

    @ApiModelProperty({
        required: false,
        example: 'your_username',
    })
    @IsOptional()
    username: string

    @ApiModelProperty({
        required: true,
        example: 'your_password123',
    })
    @IsNotEmpty()
    password: string
}
