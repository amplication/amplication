import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { EnumDataType } from "../enums/EnumDataType";
import { PropertySelector } from "./PropertySelector";

@ObjectType({
  isAbstract: true,
})
/** @todo: consider another name */
@InputType("BlockInputOutputInput", {
  isAbstract: true,
})
export class BlockInputOutput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  description?: string;

  ///static data type - one of the supported data types
  @Field(() => EnumDataType, {
    nullable: true,
  })
  dataType?: keyof typeof EnumDataType;

  ///composite data type - a reference to one of the entities
  @Field(() => String, {
    nullable: true,
  })
  dataTypeEntityName?: string;

  //indication whether this input represents a list of the selected data type
  @Field(() => Boolean, {
    nullable: true,
  })
  isList?: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  includeAllPropertiesByDefault?: boolean;

  @Field(() => [PropertySelector], {
    nullable: true,
  })
  propertyList?: PropertySelector[];
}
