import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class changeProfileNameDto {
  @ApiProperty({ type: String, description: 'Новое имя пользователя для профиля' })
  @IsString()
  @IsNotEmpty()
  new_username: string;
}