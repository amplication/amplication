import { InputType, Field } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';
import { EnumBuildStatusFilter } from './EnumBuildStatusFilter';

@InputType({
  isAbstract: true
})
export class BuildWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput)
  app?: WhereUniqueInput;

  @Field(() => EnumBuildStatusFilter, {
    nullable: true
  })
  status?: EnumBuildStatusFilter | null | undefined;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  createdBy?: WhereUniqueInput | null | undefined;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  version?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  message?: StringFilter | null;
}
