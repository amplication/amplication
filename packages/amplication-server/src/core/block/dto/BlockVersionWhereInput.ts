import { Field, InputType } from '@nestjs/graphql';
import {
  DateTimeFilter,
  StringFilter,
  IntFilter,
  WhereUniqueInput
} from 'src/dto';

@InputType({
  isAbstract: true
})
export class BlockVersionWhereInput {
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

  @Field(() => IntFilter, {
    nullable: true
  })
  versionNumber?: IntFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  label?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  block: WhereUniqueInput;
}
