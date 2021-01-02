import { Field, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonObject } from 'type-fest';
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

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: undefined
  })
  properties?: JsonObject | null;

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

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  position?: number | null;
}
