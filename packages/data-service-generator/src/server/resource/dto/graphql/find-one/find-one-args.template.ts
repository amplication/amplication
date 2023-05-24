import { ArgsType, Field } from "@nestjs/graphql";

declare class WHERE_UNIQUE_INPUT {}

@ArgsType()
export class ID {
  @Field(() => WHERE_UNIQUE_INPUT, { nullable: false })
  where!: WHERE_UNIQUE_INPUT;
}
