import { Field, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonObject } from 'type-fest';
import { EnumDataType } from 'src/enums/EnumDataType';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => EnumDataType, {
    nullable: false,
    description: undefined
  })
  dataType!: keyof typeof EnumDataType;

  @Field(() => GraphQLJSONObject, {
    nullable: false,
    description: undefined
  })
  properties!: JsonObject;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  required!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  searchable!: boolean;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  position?: number | null;
}
