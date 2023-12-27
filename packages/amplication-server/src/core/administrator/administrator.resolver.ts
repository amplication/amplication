import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Workspace } from "../../models";
import { UseFilters, UseGuards } from "@nestjs/common";
import { WorkspaceService } from "../workspace/workspace.service";
import { GqlCronGuard } from "../../guards/gql-cron.guard";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

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
