import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class AppCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  organization?: {
    connect: {
      id: string;
    };
  };
}
