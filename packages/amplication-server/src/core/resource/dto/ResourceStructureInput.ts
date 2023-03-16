import { Field, InputType } from "@nestjs/graphql";
import { EnumResourceStructureType } from "./EnumResourceStructureType";

@InputType({
  isAbstract: true,
})
export class ResourceStructureInput {
  @Field(() => EnumResourceStructureType, {
    nullable: false,
  })
  structureType!: EnumResourceStructureType;

  @Field(() => String, {
    nullable: true,
  })
  baseDirectory: string;
}
