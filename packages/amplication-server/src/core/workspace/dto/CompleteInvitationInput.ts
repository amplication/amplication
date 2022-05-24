import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class CompleteInvitationInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  token: string;
}
