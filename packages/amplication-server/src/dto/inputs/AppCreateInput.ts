import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class AppCreateInput {
  @Field(_type => String, {
    nullable: false
  })
  name!: string;

  @Field(_type => String, {
    nullable: false
  })
  description!: string;
}
