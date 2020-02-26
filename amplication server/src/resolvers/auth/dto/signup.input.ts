import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;
}
