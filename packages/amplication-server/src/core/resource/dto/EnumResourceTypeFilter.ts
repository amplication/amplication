import { EnumResourceType } from "./EnumResourceType";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EnumResourceTypeFilter {
  @Field(() => EnumResourceType, {
    nullable: true,
  })
  equals?: (typeof EnumResourceType)[keyof typeof EnumResourceType] | null;

  @Field(() => EnumResourceType, {
    nullable: true,
  })
  not?: (typeof EnumResourceType)[keyof typeof EnumResourceType] | null;

  @Field(() => [EnumResourceType], {
    nullable: true,
  })
  in?: (typeof EnumResourceType)[keyof typeof EnumResourceType][] | null;

  @Field(() => [EnumResourceType], {
    nullable: true,
  })
  notIn?: (typeof EnumResourceType)[keyof typeof EnumResourceType][] | null;
}
