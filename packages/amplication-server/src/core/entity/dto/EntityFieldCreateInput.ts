import { Field, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonObject } from 'type-fest';
import { EnumDataType } from 'src/enums/EnumDataType';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class EntityFieldCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => EnumDataType, {
    nullable: false
  })
  dataType!: keyof typeof EnumDataType;

  @Field(() => GraphQLJSONObject, {
    nullable: false
  })
  properties!: JsonObject;

  @Field(() => Boolean, {
    nullable: false
  })
  required!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  unique!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  searchable!: boolean;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  entity!: WhereParentIdInput;

  @Field(() => Int, {
    nullable: true
  })
  position?: number | null;
}
