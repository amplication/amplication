// import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
// import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
// import { EntityFieldOrderByInput } from "../../../inputs/EntityFieldOrderByInput";
// import { EntityFieldWhereInput } from "../../../inputs/EntityFieldWhereInput";
// import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

// @ArgsType()
// export class FindManyEntityFieldArgs {
//   @Field(_type => EntityFieldWhereInput, { nullable: true })
//   where?: EntityFieldWhereInput | null;

//   @Field(_type => EntityFieldOrderByInput, { nullable: true })
//   orderBy?: EntityFieldOrderByInput | null;

//   @Field(_type => Int, { nullable: true })
//   skip?: number | null;

//   @Field(_type => WhereUniqueInput, { nullable: true })
//   after?: WhereUniqueInput | null;

//   @Field(_type => WhereUniqueInput, { nullable: true })
//   before?: WhereUniqueInput | null;

//   @Field(_type => Int, { nullable: true })
//   first?: number | null;

//   @Field(_type => Int, { nullable: true })
//   last?: number | null;
// }
