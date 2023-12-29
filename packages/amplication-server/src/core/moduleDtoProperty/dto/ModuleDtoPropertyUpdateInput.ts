import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { EnumModuleDtoPropertyType } from "./EnumModuleDtoPropertyType";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyUpdateInput extends BlockUpdateInput {
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
