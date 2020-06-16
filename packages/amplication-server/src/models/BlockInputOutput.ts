import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { EnumDataType } from 'src/enums/EnumDataType';
import { PropertySelector } from './PropertySelector';

@ObjectType({
  isAbstract: true,
  description: undefined
})
/** @todo: consider another name */
@InputType('BlockInputOutputInput', {
  isAbstract: true,
  description: undefined
})
export class BlockInputOutput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description?: string;

  ///static data type - one of the supported data types
  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType;

  ///composite data type - a reference to one of the entities
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  dataTypeEntityName?: string;

  //indication whether this input represents a list of the selected data type
  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  isList?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  includeAllPropertiesByDefault?: boolean;

  @Field(() => [PropertySelector], {
    nullable: true,
    description: undefined
  })
  propertyList?: PropertySelector[];
}
