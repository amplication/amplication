import { Field, ArgsType } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class PostIdArgs {
  @Field(type => String)
  @IsNotEmpty()
  postId: string;
}
