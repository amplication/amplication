export enum EnumEventType {
  UnknownEvent = "UNKNOWN_EVENT",
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
  CreateModule = "CreateModule",
  InteractModule = "InteractModule",
  CreateUserAction = "CreateUserAction",
  InteractUserAction = "InteractUserAction",
  InteractAmplicationAction = "InteractAmplicationAction",
  CreateUserDTO = "CreateUserDTO",
  InteractUserDTO = "InteractUserDTO",
  ServiceCreate = "createService",
  MessageBrokerCreate = "createMessageBroker",
  PluginRepositoryCreate = "createPluginRepository",
  ServiceTemplateCreate = "createServiceTemplate",
  CreateResourceFromTemplate = "createResourceFromTemplate",
  ResourceVersionCreate = "createResourceVersion",
  ComponentCreate = "createComponent",

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
  StartJovuThread = "StartJovuThread",

  //Teams
  TeamCreate = "TeamCreate",
  TeamUpdate = "TeamUpdate",
  TeamDelete = "TeamDelete",
  TeamAddMembers = "TeamAddMembers",
  TeamRemoveMembers = "TeamRemoveMembers",
  TeamAddRoles = "TeamAddRoles",
  TeamRemoveRoles = "TeamRemoveRoles",
  TeamDeleteAssignment = "TeamDeleteAssignment",
  TeamAssignmentAddRoles = "TeamAssignmentAddRoles",
  TeamAssignmentRemoveRoles = "TeamAssignmentRemoveRoles",

  //Custom Properties
  CustomPropertyCreate = "CustomPropertyCreate",
  CustomPropertyUpdate = "CustomPropertyUpdate",
  CustomPropertyDelete = "CustomPropertyDelete",

  //Blueprints
  BlueprintCreate = "BlueprintCreate",
  BlueprintUpdate = "BlueprintUpdate",
  BlueprintUpdateEngine = "BlueprintUpdateEngine",
  BlueprintDelete = "BlueprintDelete",

  //Roles
  RoleCreate = "RoleCreate",
  RoleUpdate = "RoleUpdate",
  RoleDelete = "RoleDelete",
}
