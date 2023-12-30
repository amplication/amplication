import { Field, InputType } from "@nestjs/graphql";
import { JsonValue } from "type-fest";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";
import { PropertyTypeDef } from "./propertyTypes/PropertyTypeDef";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyCreateInput extends BlockCreateInput {
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
