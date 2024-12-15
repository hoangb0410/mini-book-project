import { IsEmail, IsNotEmpty, MinLength } from "@nestjs/class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @MinLength(5)
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class RegisterDTO {
    @IsNotEmpty()
    @MinLength(5)
    username: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}