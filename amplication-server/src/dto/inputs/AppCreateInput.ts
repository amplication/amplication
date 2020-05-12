import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from './';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  //do not expose to graphQL - use the user's current organization
  organization!: WhereParentIdInput;
}
