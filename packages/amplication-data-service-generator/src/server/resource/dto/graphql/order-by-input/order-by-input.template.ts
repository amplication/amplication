import { Field, InputType } from "@nestjs/graphql";
//@ts-ignore
import { SortOrder } from "../../util/SortOrder";
import { ApiProperty } from "@nestjs/swagger";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class ID {
  @ApiProperty({
    required: false,
    enum: ["Asc", "Desc"],
  })
  @Field(() => SortOrder, {
    nullable: true,
  })
  FIELD_NAME?: SortOrder;
}
