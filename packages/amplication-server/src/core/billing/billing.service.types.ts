import { Project, User } from "../../models";

export interface ValidateSubscriptionPlanLimitationsArgs {
  workspaceId: string;
  currentUser: User;
  currentProjectId: string;
  projects: Project[];
  bypassLimitations?: boolean;
}
