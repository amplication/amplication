import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlCronGuard } from "../../guards/gql-cron.guard";
import { Workspace } from "../../models";
import { WorkspaceService } from "../workspace/workspace.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => Workspace)
@UseFilters(GqlResolverExceptionsFilter)
export class AdministratorResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlCronGuard)
  async bulkUpdateWorkspaceProjectsAndResourcesLicensed(
    @Args({ name: "useUserLastActive", nullable: true, type: () => Boolean })
    useUserLastActive?: boolean
  ): Promise<boolean> {
    return this.workspaceService.bulkUpdateWorkspaceProjectsAndResourcesLicensed(
      useUserLastActive ?? true
    );
  }
}
