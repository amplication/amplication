export enum EnumEventType {
  Signup = "Signup",
  StartEmailSignup = "StartEmailSignup",
  CompleteEmailSignup = "CompleteEmailSignup",
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
