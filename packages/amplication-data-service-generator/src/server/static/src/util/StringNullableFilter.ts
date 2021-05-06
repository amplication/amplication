import { Field, InputType } from '@nestjs/graphql';
import { QueryMode } from './QueryMode';

@InputType({
  isAbstract: true
})
export class StringNullableFilter {
  @Field(() => String, {
    nullable: true
  })
  equals?: string | null;

  @Field(() => [String], {
    nullable: true
  })
  in?: string[] | null;

  @Field(() => [String], {
    nullable: true
  })
  notIn?: string[] | null;

  @Field(() => String, {
    nullable: false
  })
  lt?: string ;

  @Field(() => String, {
    nullable: false
  })
  lte?: string ;

  @Field(() => String, {
    nullable: false
  })
  gt?: string ;

  @Field(() => String, {
    nullable: false
  })
  gte?: string ;

  @Field(() => String, {
    nullable: false
  })
  contains?: string ;

  @Field(() => String, {
    nullable: false
  })
  startsWith?: string ;

  @Field(() => String, {
    nullable: false
  })
  endsWith?: string ;

  @Field(() => QueryMode, {
    nullable: false
  })
  mode?: QueryMode;

  @Field(() => String, {
    nullable: false
  })
  not?: string ;
}
