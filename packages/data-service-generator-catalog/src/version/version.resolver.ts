import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import { Public } from "../decorators/public.decorator";
import { Version } from "./base/Version";
import { VersionResolverBase } from "./base/version.resolver.base";
import { GetCodeGeneratorVersionInput } from "./dto/GetCodeGeneratorVersionInput";
import { VersionService } from "./version.service";
import { boolean } from "@amplication/code-gen-types/schemas";
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => Version)
export class VersionResolver extends VersionResolverBase {
  constructor(
    protected readonly service: VersionService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @Public()
  @graphql.Query(() => Version)
  async getCodeGeneratorVersion(
    @graphql.Args("GetCodeGeneratorVersionInput")
    args: GetCodeGeneratorVersionInput
  ): Promise<Version> {
    const res = await this.service.getCodeGeneratorVersion(args);
    return res;
  }

  @Public()
  @graphql.Mutation(() => Boolean)
  async sync(): Promise<boolean> {
    await this.service.syncVersions();
    return true;
  }
}
