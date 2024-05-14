import * as graphql from "@nestjs/graphql";
import { CategoryResolverBase } from "./base/category.resolver.base";
import { Category } from "./base/Category";
import { CategoryService } from "./category.service";

@graphql.Resolver(() => Category)
export class CategoryResolver extends CategoryResolverBase {
  constructor(protected readonly service: CategoryService) {
    super(service);
  }
}
