import { InputType, Field } from '@nestjs/graphql';
import {
  WhereUniqueInput,
  DateTimeFilter,
  StringFilter,
  WhereParentIdInput
} from 'src/dto';
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

  @Field(() => WhereParentIdInput)
  app?: WhereParentIdInput;

  @Field(() => EnumBuildStatusFilter, {
    nullable: true
  })
  status?: EnumBuildStatusFilter | null | undefined;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  createdBy?: WhereUniqueInput | null | undefined;
}
