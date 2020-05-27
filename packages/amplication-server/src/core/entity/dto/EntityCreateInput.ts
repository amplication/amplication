import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from '../../../dto/inputs';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  pluralDisplayName!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  isPersistent!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  allowFeedback!: boolean;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  primaryField?: string;

  @Field(_type => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;
}
