import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class ResourceRoleCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  resource!: WhereParentIdInput;
}
