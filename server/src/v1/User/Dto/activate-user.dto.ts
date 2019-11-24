import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'

export class ActivateUserDto {
    @ApiModelProperty({
        required: true,
        example: 'example@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string
}
