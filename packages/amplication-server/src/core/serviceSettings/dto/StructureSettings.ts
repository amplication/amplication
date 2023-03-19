import { Field, ObjectType } from "@nestjs/graphql";
import { EnumResourceStructureType } from "../../resource/dto/EnumResourceStructureType";

@ObjectType({
  isAbstract: true,
})
export class StructureSettings {
  @Field(() => EnumResourceStructureType, {
    nullable: false,
  })
  structureType!: EnumResourceStructureType;

  @Field(() => String, {
    nullable: true,
  })
  baseDirectory: string;
}
