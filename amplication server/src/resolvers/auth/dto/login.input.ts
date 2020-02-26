import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
