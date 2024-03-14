import { Field, InputType } from "@nestjs/graphql";
import { PropertyTypeDef } from "./propertyTypes/PropertyTypeDef";

@InputType({
  isAbstract: true,
})
export class ModuleDtoPropertyUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => [PropertyTypeDef], {
    nullable: false,
  })
  propertyTypes!: PropertyTypeDef[];

  @Field(() => Boolean, {
    nullable: false,
  })
  isOptional!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  isArray!: boolean;
}
