import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

declare class CREATE_INPUT {}

@ArgsType()
export class ID {
  @ApiProperty({
    required: true,
    type: () => CREATE_INPUT,
  })
  @ValidateNested()
  @Type(() => CREATE_INPUT)
  @Field(() => CREATE_INPUT, { nullable: false })
  data!: CREATE_INPUT;
}
