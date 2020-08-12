import { InputType, Field } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';
import { EnumBuildStatusFilter } from './EnumBuildStatusFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BuildWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  userId?: StringFilter | null | undefined;

  @Field(() => EnumBuildStatusFilter, {
    nullable: true,
    description: undefined
  })
  status?: EnumBuildStatusFilter | null | undefined;

  @Field(() => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  createdBy?: WhereUniqueInput | null | undefined;
}
