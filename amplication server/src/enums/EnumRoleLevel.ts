import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";

export enum EnumRoleLevel {
  Organization = "Organization",
  Project = "Project"
}
registerEnumType(EnumRoleLevel, {
  name: "EnumRoleLevel",
  description: undefined,
});
