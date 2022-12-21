import * as graphql from "@nestjs/graphql";
import { ProfileResolverBase } from "./base/profile.resolver.base";
import { Profile } from "./base/Profile";
import { ProfileService } from "./profile.service";

@graphql.Resolver(() => Profile)
export class ProfileResolver extends ProfileResolverBase {
  constructor(protected readonly service: ProfileService) {
    super(service);
  }
}
