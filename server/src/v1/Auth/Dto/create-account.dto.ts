// Nest dependencies
import { ApiModelProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty, NotContains, Length, MaxLength } from 'class-validator'

export class CreateAccountDto {
    @ApiModelProperty({
        required: true,
        example: `Example Name`,
    })
    @IsNotEmpty()
    @MaxLength(50)
    fullName: string

    @ApiModelProperty({
        required: true,
        example: `example@gmail.com`,
    })
    @IsEmail()
    email: string

    @ApiModelProperty({
        required: true,
        example: `your_username`,
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 15)
    username: string

    @ApiModelProperty({
        required: true,
        example: `your_password123`,
    })
    @IsNotEmpty()
    @NotContains(` `)
    @Length(6, 15)
    password: string
}
