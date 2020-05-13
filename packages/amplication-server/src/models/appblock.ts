import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class AppBlock {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  test!: string;

  test1: string;


}
