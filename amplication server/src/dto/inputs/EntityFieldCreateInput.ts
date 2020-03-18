import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
//import { EntityVersionCreateOneWithoutEntityFieldsInput } from "../inputs/EntityVersionCreateOneWithoutEntityFieldsInput";
import { EnumDataType } from "../../enums/EnumDataType";
import { WhereParentIdInput } from './WhereParentIdInput'

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityFieldCreateInput {

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(_type => EnumDataType, {
    nullable: false,
    description: undefined
  })
  dataType!: keyof typeof EnumDataType;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  dataTypeProperties!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  properties!: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  required!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  searchable!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  // @Field(_type => EntityVersionCreateOneWithoutEntityFieldsInput, {
  //   nullable: false,
  //   description: undefined
  // })
  entityVersion!: WhereParentIdInput;
  
  @Field(_type => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;

  // @Field(_type => String, {
  //   nullable: false,
  //   description: undefined
  // })
  // entityId!: string;
}
