import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
//import { EntityCreateOneWithoutEntityVersionsInput } from "../inputs/EntityCreateOneWithoutEntityVersionsInput";
import { WhereParentIdInput } from './WhereParentIdInput'
import { EntityFieldConnectInput } from "../inputs/EntityFieldConnectInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityVersionCreateInput {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  Label!: string;

  @Field(_type => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  //entity!: Entity;
  entity!: WhereParentIdInput;

  @Field(_type => EntityFieldConnectInput, {
    nullable: true,
    description: undefined
  })
  entityFields?: EntityFieldConnectInput | null;
}
