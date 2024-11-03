import { Field, InputType } from "@nestjs/graphql";
import { JsonPathStringFilter } from "../../../dto/JsonPathStringFilter";
import { ResourceWhereInput } from "./ResourceWhereInput";

@InputType({
  isAbstract: true,
})
export class ResourceWhereInputWithPropertiesFilter extends ResourceWhereInput {
  @Field(() => JsonPathStringFilter, {
    nullable: true,
  })
  properties?: JsonPathStringFilter;
}
