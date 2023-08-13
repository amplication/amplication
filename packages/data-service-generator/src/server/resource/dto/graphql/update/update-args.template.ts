import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

declare class WHERE_UNIQUE_INPUT {}
declare class UPDATE_INPUT {}

@ArgsType()
export class ID {
  @ApiProperty({
    required: true,
    type: () => WHERE_UNIQUE_INPUT,
  })
  @ValidateNested()
  @Type(() => WHERE_UNIQUE_INPUT)
  @Field(() => WHERE_UNIQUE_INPUT, { nullable: false })
  where!: WHERE_UNIQUE_INPUT;

  @ApiProperty({
    required: true,
    type: () => UPDATE_INPUT,
  })
  @ValidateNested()
  @Type(() => UPDATE_INPUT)
  @Field(() => UPDATE_INPUT, { nullable: false })
  data!: UPDATE_INPUT;
}
