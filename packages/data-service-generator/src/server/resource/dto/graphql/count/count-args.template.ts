import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

declare class WHERE_INPUT {}

@ArgsType()
export class ID {
  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @Field(() => WHERE_INPUT, { nullable: true })
  @Type(() => WHERE_INPUT)
  where?: WHERE_INPUT;
}
