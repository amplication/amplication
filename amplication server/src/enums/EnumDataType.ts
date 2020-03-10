import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";

export enum EnumDataType {
  Text = "Text",
  AutoNumber = "AutoNumber",
  WholeNumber = "WholeNumber",
  TimeZone = "TimeZone",
  Language = "Language",
  DateAndTime = "DateAndTime",
  Currancy = "Currancy",
  DecimalNumber = "DecimalNumber",
  File = "File",
  Image = "Image",
  Lookup = "Lookup",
  CustomEntity = "CustomEntity",
  OptionSet = "OptionSet",
  Boolean = "Boolean",
  Color = "Color",
  Guid = "Guid",
  Time = "Time",
  CalculatedField = "CalculatedField",
  RollupField = "RollupField"
}
registerEnumType(EnumDataType, {
  name: "EnumDataType",
  description: undefined,
});
