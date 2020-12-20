import { ArgsType, Field } from "@nestjs/graphql";

declare class CREATE_INPUT {}

@ArgsType()
export class ID {
  @Field(() => CREATE_INPUT, { nullable: false })
  data!: CREATE_INPUT;
}
