import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiModelProperty({
    required: false,
  })
  @IsEmail()
  email: string;

  @ApiModelProperty({
    required: false,
  })
  username: string;

  @ApiModelProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
