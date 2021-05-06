import { Field, InputType } from '@nestjs/graphql';
import { QueryMode } from './QueryMode';

@InputType({
  isAbstract: true
})
export class StringFilter {
  @Field(() => String, {
    nullable: false
  })
  equals?: string ;

  @Field(() => String, {
    nullable: false
  })
  not?: string ;

  @Field(() => [String], {
    nullable: false
  })
  in?: string[] ;

  @Field(() => [String], {
    nullable: false
  })
  notIn?: string[] ;

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
}
