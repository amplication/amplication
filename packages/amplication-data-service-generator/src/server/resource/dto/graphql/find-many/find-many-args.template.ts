import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

declare class WHERE_INPUT {}
declare class ORDER_BY_INPUT {}

@ArgsType()
export class ID {
  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @Field(() => WHERE_INPUT, { nullable: true })
  @Type(() => WHERE_INPUT)
  where?: WHERE_INPUT;

  @ApiProperty({
    required: false,
    type: ORDER_BY_INPUT,
  })
  @Field(() => ORDER_BY_INPUT, { nullable: true })
  @Type(() => ORDER_BY_INPUT)
  orderBy?: ORDER_BY_INPUT;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  take?: number;
}
