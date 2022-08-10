import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class EntityCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  resource!: WhereParentIdInput;
}
