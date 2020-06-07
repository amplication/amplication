import { Field, InputType } from '@nestjs/graphql';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  displayName?: string | null;

  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType | null;

  /** @todo: replace with type JSON or an actual model  */
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  properties?: object | null;

  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  required?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  searchable?: boolean | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string | null;
}
