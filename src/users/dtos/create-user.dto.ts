import { IsEmail, IsString } from 'class-validator'

export class CrerateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
