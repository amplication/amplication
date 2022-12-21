import * as graphql from "@nestjs/graphql";
import { OrganizationResolverBase } from "./base/organization.resolver.base";
import { Organization } from "./base/Organization";
import { OrganizationService } from "./organization.service";

@graphql.Resolver(() => Organization)
export class OrganizationResolver extends OrganizationResolverBase {
  constructor(protected readonly service: OrganizationService) {
    super(service);
  }
}
