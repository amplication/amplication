import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class ProjectCreateInput {
  @Field(() => String, { nullable: false })
  name!: string;

  workspace?: {
    connect: {
      id: string;
    };
  };
}
