import { Field, InputType } from "@nestjs/graphql";
//@ts-ignore
import { SortOrder } from "../../util/SortOrder";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class ID {
  @ApiProperty({
    required: false,
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsEnum(SortOrder)
  @Field(() => SortOrder, {
    nullable: true,
  })
  FIELD_NAME?: SortOrder;
}
