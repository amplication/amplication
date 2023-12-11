import { Project, User, GitRepository } from "../../models";

export interface ValidateSubscriptionPlanLimitationsArgs {
  workspaceId: string;
  currentUser: User;
  currentProjectId: string;
  projects: Project[];
  repositories: GitRepository[];
  /**
   * If true and all the failing entitlements
   * have bypassableCodeGenerationBuild metadata
   * as true, the validation will be bypassed
   * and the function will return true
   */
  bypassLimitations?: boolean;
}
