import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ResourceOrderByInput } from "./ResourceOrderByInput";
import { ResourceWhereInputWithPropertiesFilter } from "./ResourceWhereInputWithPropertiesFilter";

@ArgsType()
export class FindManyResourceArgs {
  @Field(() => ResourceWhereInputWithPropertiesFilter, { nullable: true })
  where?: ResourceWhereInputWithPropertiesFilter | null;

  @Field(() => [ResourceOrderByInput], { nullable: true })
  orderBy?: ResourceOrderByInput[] | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
