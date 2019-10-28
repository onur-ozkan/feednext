import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiModelProperty({
    required: true,
  })
  @IsNotEmpty()
  fullName: string;

  @ApiModelProperty({
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiModelProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
