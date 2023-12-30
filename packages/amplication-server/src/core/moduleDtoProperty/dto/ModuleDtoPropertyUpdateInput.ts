import { Field, InputType } from "@nestjs/graphql";
import { JsonValue } from "type-fest";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { PropertyTypeDef } from "./propertyTypes/PropertyTypeDef";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;

  @Field(() => [PropertyTypeDef], {
    nullable: false,
  })
  propertyTypes!: PropertyTypeDef[] & JsonValue;

  @Field(() => Boolean, {
    nullable: false,
  })
  isOptional!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  isArray!: boolean;
}
