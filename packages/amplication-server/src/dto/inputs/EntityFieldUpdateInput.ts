import { Field, InputType } from '@nestjs/graphql';
import { EnumDataType } from '../../enums/EnumDataType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  displayName?: string | null;

  @Field(_type => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  properties?: string | null;

  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  required?: boolean | null;

  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  searchable?: boolean | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  description?: string | null;
}
