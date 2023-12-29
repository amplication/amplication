import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { EnumModuleDtoPropertyType } from "./EnumModuleDtoPropertyType";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class ModuleDtoProperty extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => EnumModuleDtoPropertyType, {
    nullable: false,
  })
  propertyType!: keyof typeof EnumModuleDtoPropertyType;

  @Field(() => Boolean, {
    nullable: false,
  })
  isOptional!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  isArray!: boolean;
}
