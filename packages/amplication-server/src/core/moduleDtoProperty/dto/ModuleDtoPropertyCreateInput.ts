import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { EnumModuleDtoPropertyType } from "./EnumModuleDtoPropertyType";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

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
