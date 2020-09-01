import { Field, InputType } from '@nestjs/graphql';
import { QueryMode } from 'src/enums/QueryMode';

@InputType({
  isAbstract: true
})
export class StringFilter {
  @Field(() => String, {
    nullable: true
  })
  equals?: string | null;

  @Field(() => String, {
    nullable: true
  })
  not?: string | null;

  @Field(() => [String], {
    nullable: true
  })
  in?: string[] | null;

  @Field(() => [String], {
    nullable: true
  })
  notIn?: string[] | null;

  @Field(() => String, {
    nullable: true
  })
  lt?: string | null;

  @Field(() => String, {
    nullable: true
  })
  lte?: string | null;

  @Field(() => String, {
    nullable: true
  })
  gt?: string | null;

  @Field(() => String, {
    nullable: true
  })
  gte?: string | null;

  @Field(() => String, {
    nullable: true
  })
  contains?: string | null;

  @Field(() => String, {
    nullable: true
  })
  startsWith?: string | null;

  @Field(() => String, {
    nullable: true
  })
  endsWith?: string | null;

  @Field(() => QueryMode, {
    nullable: true
  })
  mode?: QueryMode;
}
