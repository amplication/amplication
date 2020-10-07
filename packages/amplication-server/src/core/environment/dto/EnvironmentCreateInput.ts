import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class EnvironmentCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: true
  })
  description?: string;

  @Field(() => String, {
    nullable: false
  })
  address!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;
}
