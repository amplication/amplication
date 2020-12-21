import { ArgsType, Field } from "@nestjs/graphql";

declare class WHERE_INPUT {}

@ArgsType()
export class ID {
  @Field(() => WHERE_INPUT, { nullable: false })
  where!: WHERE_INPUT;
}
