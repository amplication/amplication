import { Field, InputType } from '@nestjs/graphql';
import {
  DateTimeFilter,
  StringFilter,
  IntFilter,
  WhereUniqueInput
} from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BlockVersionWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => IntFilter, {
    nullable: true,
    description: undefined
  })
  versionNumber?: IntFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  label?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  block: WhereUniqueInput;
}
