import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;
}
