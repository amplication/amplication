import * as graphql from "@nestjs/graphql";
import { EmptyResolverBase } from "./base/empty.resolver.base";
import { Empty } from "./base/Empty";
import { EmptyService } from "./empty.service";

@graphql.Resolver(() => Empty)
export class EmptyResolver extends EmptyResolverBase {
  constructor(protected readonly service: EmptyService) {
    super(service);
  }
}
