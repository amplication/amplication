import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class ResourceCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  @Field(() => String, {
    nullable: true
  })
  color?: string;

  workspace?: {
    connect: {
      id: string;
    };
  };
}
