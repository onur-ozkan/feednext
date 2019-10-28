import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountRecoveryDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
