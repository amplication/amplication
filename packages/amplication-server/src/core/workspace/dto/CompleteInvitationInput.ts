import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CompleteInvitationInput {
  @Field(() => String, {
    nullable: false,
  })
  token: string;
}
