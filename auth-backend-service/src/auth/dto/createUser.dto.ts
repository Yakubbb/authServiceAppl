import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Уникальный логин пользователя' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @ApiProperty({ type: String, description: 'Адрес электронной почты пользователя' })
  @IsEmail({}, { message: 'Пожалуйста, введите корректный email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, description: 'Отображаемое имя пользователя' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Пароль слишком слабый. Он должен содержать заглавные и строчные буквы, а также цифры или спецсимволы.',
  })
  password: string;
}
