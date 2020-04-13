import { Field, InputType } from "@nestjs/graphql";
import { OrderByArg } from "../../enums/OrderByArg";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class OrganizationOrderByInput {
  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  updatedAt?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  name?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  address?: keyof typeof OrderByArg | null;
}
