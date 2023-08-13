import { Field, InputType } from "@nestjs/graphql";
import { EnumDataType } from "../../../enums/EnumDataType";

@InputType({
  isAbstract: true,
})
export class EnumDataTypeFilter {
  @Field(() => EnumDataType, {
    nullable: true,
  })
  equals?: keyof typeof EnumDataType | null;

  @Field(() => EnumDataType, {
    nullable: true,
  })
  not?: keyof typeof EnumDataType | null;

  @Field(() => [EnumDataType], {
    nullable: true,
  })
  in?: Array<keyof typeof EnumDataType | null>;

  @Field(() => [EnumDataType], {
    nullable: true,
  })
  notIn?: Array<keyof typeof EnumDataType | null>;
}
