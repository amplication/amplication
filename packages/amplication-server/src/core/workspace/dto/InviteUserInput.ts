import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class InviteUserInput {
  @Field(() => String, {
    nullable: false,
  })
  email: string;
}
