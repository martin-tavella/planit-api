import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'The password must contain at least one special character',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'The password must contain at least one uppercase letter',
  })
  password: string;
}
