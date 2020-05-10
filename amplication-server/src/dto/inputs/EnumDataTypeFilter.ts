import { Field, InputType } from "@nestjs/graphql";
import { EnumDataType } from "../../enums/EnumDataType";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EnumDataTypeFilter {
  @Field(_type => EnumDataType, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumDataType | null;

  @Field(_type => EnumDataType, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumDataType | null;

  @Field(_type => [EnumDataType], {
    nullable: true,
    description: undefined
  })
  in?: keyof typeof EnumDataType[] | null;

  @Field(_type => [EnumDataType], {
    nullable: true,
    description: undefined
  })
  notIn?: keyof typeof EnumDataType[] | null;
}
