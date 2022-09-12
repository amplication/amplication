import { Field, InputType } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';

import { EnumBlockTypeFilter } from './EnumBlockTypeFilter';
@InputType({
  isAbstract: true
})
export class BlockWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  resource?: WhereUniqueInput | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  parentBlock?: WhereUniqueInput | null;

  @Field(() => EnumBlockTypeFilter, {
    nullable: true
  })
  blockType?: EnumBlockTypeFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  displayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  description?: StringFilter | null;

  // AND?: BlockWhereInput[] | null;

  // OR?: BlockWhereInput[] | null;

  // NOT?: BlockWhereInput[] | null;
}
