import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class changeProfileNameDto {
  @IsString()
  @IsNotEmpty()
  new_username: string;
}