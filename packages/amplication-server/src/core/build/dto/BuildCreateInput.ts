import { InputType, Field } from '@nestjs/graphql';
import { ConnectManyUniqueInput } from 'src/dto/ConnectManyUniqueInput';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BuildCreateInput {
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
