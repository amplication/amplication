import { InputType, Field } from '@nestjs/graphql';
import { EnumBuildStatus } from './EnumBuildStatus';
import { WhereParentIdInput } from 'src/dto';
import { ConnectManyUniqueInput } from 'src/dto/ConnectManyUniqueInput';

@InputType({
  isAbstract: true
})
export class BuildCreateInput {
  @Field(() => String, {
    nullable: true
  })
  id?: string | null | undefined;

  @Field(() => Date, {
    nullable: true
  })
  createdAt?: Date | null | undefined;

  @Field(() => EnumBuildStatus, {
    nullable: false
  })
  status!: keyof typeof EnumBuildStatus;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  createdBy!: WhereParentIdInput;

  @Field(() => ConnectManyUniqueInput, {
    nullable: true
  })
  blockVersions?: ConnectManyUniqueInput;

  @Field(() => ConnectManyUniqueInput, {
    nullable: false
  })
  entityVersions: ConnectManyUniqueInput;
}
