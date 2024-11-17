import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class BlueprintCreateInput {
  @Field(() => String, { nullable: false })
  name!: string;

  workspace?: {
    connect: {
      id: string;
    };
  };
}
