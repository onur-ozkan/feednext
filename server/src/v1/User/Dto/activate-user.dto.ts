// Nest dependencies
import { ApiModelProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ActivateUserDto {
    @ApiModelProperty({
        required: true,
        example: `example@gmail.com`,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string
}
