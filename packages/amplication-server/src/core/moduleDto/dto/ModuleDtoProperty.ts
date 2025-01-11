import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PropertyTypeDef } from "./propertyTypes/PropertyTypeDef";
@InputType("ModuleDtoPropertyInput", {
  isAbstract: true,
})
@ObjectType({
  isAbstract: true,
})
export class ModuleDtoProperty {
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
