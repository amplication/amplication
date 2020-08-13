import { InputType, Field } from '@nestjs/graphql';
import { ConnectManyUniqueInput } from 'src/dto/ConnectManyUniqueInput';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BuildCreateInput {
  // Do not expose, injected by the context
  createdBy: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  app!: WhereParentIdInput;

  @Field(() => ConnectManyUniqueInput, {
    nullable: true
  })
  blockVersions!: ConnectManyUniqueInput;

  @Field(() => ConnectManyUniqueInput, {
    nullable: false
  })
  entityVersions!: ConnectManyUniqueInput;
}
