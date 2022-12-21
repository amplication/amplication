import * as graphql from "@nestjs/graphql";
import { UserResolverBase } from "./base/user.resolver.base";
import { User } from "./base/User";
import { UserService } from "./user.service";

@graphql.Resolver(() => User)
export class UserResolver extends UserResolverBase {
  constructor(protected readonly service: UserService) {
    super(service);
  }
}
