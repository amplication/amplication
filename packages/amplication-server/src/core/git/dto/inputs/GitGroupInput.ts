import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class GitGroupInput {
  @Field(() => String, { nullable: false })
  organizationId!: string;
}
