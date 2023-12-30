import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";
import { PropertyTypeDef } from "./propertyTypes/PropertyTypeDef";
@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class ModuleDtoProperty extends IBlock {
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
