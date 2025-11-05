import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ type: String, description: 'Логин пользователя', required: false })
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => !o.email)
  login?: string;

  @ApiProperty({ type: String, description: 'Адрес электронной почты пользователя', required: false })
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf(o => !o.login)
  email?: string;

  @ApiProperty({ type: String, description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}