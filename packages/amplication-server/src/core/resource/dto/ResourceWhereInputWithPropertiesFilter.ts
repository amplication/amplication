import { Field, InputType } from "@nestjs/graphql";
import { JsonPathStringFilter } from "../../../dto/JsonPathStringFilter";
import { ResourceWhereInput } from "./ResourceWhereInput";
import { StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class ResourceWhereInputWithPropertiesFilter extends ResourceWhereInput {
  @Field(() => JsonPathStringFilter, {
    nullable: true,
  })
  properties?: JsonPathStringFilter;

  @Field(() => StringFilter, { nullable: true })
  projectIdFilter?: StringFilter | null;
}
