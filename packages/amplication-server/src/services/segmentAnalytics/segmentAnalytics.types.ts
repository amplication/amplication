export enum EnumEventType {
  Signup = "Signup",
  StartEmailSignup = "StartEmailSignup",
  WorkspacePlanUpgradeRequest = "WorkspacePlanUpgradeRequest",
  WorkspacePlanUpgradeCompleted = "WorkspacePlanUpgradeCompleted",
  WorkspacePlanDowngradeRequest = "WorkspacePlanDowngradeRequest",
  CommitCreate = "commit",
  WorkspaceSelected = "selectWorkspace",
  GitHubAuthResourceComplete = "completeAuthResourceWithGitHub",
  ServiceWizardServiceGenerated = "ServiceWizard_ServiceGenerated",
  SubscriptionLimitPassed = "SubscriptionLimitPassed",
  EntityCreate = "createEntity",
  EntityUpdate = "updateEntity",
  EntityFieldCreate = "createEntityField",
  EntityFieldUpdate = "updateEntityField",
  EntityFieldFromImportPrismaSchemaCreate = "EntityFieldFromImportPrismaSchemaCreate",
  PluginInstall = "installPlugin",
  PluginUpdate = "updatePlugin",
  DemoRepoCreate = "CreateDemoRepo",
  InvitationAcceptance = "invitationAcceptance",

  //Import Prisma Schema
  ImportPrismaSchemaStart = "importPrismaSchemaStart",
  ImportPrismaSchemaError = "importPrismaSchemaError",
  ImportPrismaSchemaCompleted = "importPrismaSchemaCompleted",

  GitSyncError = "gitSyncError",
  CodeGenerationError = "codeGenerationError",

  CodeGeneratorVersionUpdate = "codeGeneratorVersionUpdate",

  RedeemCoupon = "RedeemCoupon",

  // break the monolith
  ArchitectureRedesignStartRedesign = " architectureRedesign_StartRedesign",
  ArchitectureRedesignApply = "architectureRedesign__Apply",
  ArchitectureRedesignStartBreakTheMonolith = "architectureRedesign__StartBreakTheMonolith",
}

export type IdentifyData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export type TrackData = {
  userId: string;
  event: EnumEventType;
  properties?:
    | {
        [key: string]: unknown;
      }
    | undefined;
  context?: {
    traits?: IdentifyData;
    amplication?: {
      analyticsSessionId?: string;
    };
  };
};
