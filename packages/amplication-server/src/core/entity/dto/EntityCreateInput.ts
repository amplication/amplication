import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;
}
