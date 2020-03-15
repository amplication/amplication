import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  lastName?: string;
}
