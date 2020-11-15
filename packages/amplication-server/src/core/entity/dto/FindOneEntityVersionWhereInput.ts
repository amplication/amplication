import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class FindOneEntityVersionWhereInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;
}
