import { Field, ArgsType } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class UserIdArgs {
  @Field(type => String)
  @IsNotEmpty()
  userId: string;
}
