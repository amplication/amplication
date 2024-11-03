//This filter is a subset of the Prisma JsonFilter, with the following differences:
//We only use string filters,
//we use camelCase format instead of snake_case to match the rest of the codebase
//we expose a single filter that is an array of filters that are all matched (AND)
//we expect a comma separated string for the path, instead of an array of strings

import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class JsonPathStringFilterItem {
  @Field(() => String, {
    nullable: true,
  })
  equals?: string;

  @Field(() => String, {
    nullable: true,
  })
  arrayContains?: string;

  @Field(() => String, {
    nullable: true,
  })
  stringContains?: string;

  @Field(() => String, {
    nullable: false,
  })
  path!: string; // "path.inner.something"
}

@InputType({
  isAbstract: true,
})
export class JsonPathStringFilter {
  @Field(() => [JsonPathStringFilterItem], {
    nullable: false,
  })
  matchAll!: JsonPathStringFilterItem[];
}
