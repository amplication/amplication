import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { EnumModuleDtoPropertyType } from "./EnumModuleDtoPropertyType";

@InputType("PropertyTypeDefInput", {
  isAbstract: true,
})
@ObjectType({
  isAbstract: true,
})
export class PropertyTypeDef {
  @Field(() => EnumModuleDtoPropertyType, {
    nullable: false,
  })
  type!: keyof typeof EnumModuleDtoPropertyType;

  @Field(() => Boolean, {
    nullable: false,
  })
  isArray!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  dtoId?: string;
}
