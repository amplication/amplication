export enum BillingPlan {
  Free = "plan-amplication-free",
  Pro = "plan-amplication-pro",
  Enterprise = "plan-amplication-enterprise",
  ProWithTrial = "plan-amplication-pro-with-trial",
}

export enum BillingFeature {
  CodeGenerationBuilds = "feature-code-generation-builds",
  CodePushToGit = "feature-code-push-to-git",
  EntitiesPerService = "feature-entities-per-service",
  HideNotifications = "feature-ignore-validation-code-generation-hide-notifications",
  IgnoreValidationCodeGeneration = "feature-ignore-validation-code-generation",
  Services = "feature-services",
  ServicesAboveEntitiesPerServiceLimit = "feature-services-above-entities-per-service-limit",
  ServicesWithManyEntities = "feature-services-wth-many-entities",
  SmartGitSync = "feature-smart-git-sync",
  TeamMembers = "feature-team-members",
  AwsCodeCommit = "feature-awscodecommit",
  Bitbucket = "feature-bitbucket",
  ImportDBSchema = "feature-import-db-schema",
  ChangeGitBaseBranch = "feature-change-git-base-branch",
  Notification = "feature-notifications",
  BranchPerResource = "feature-branch-per-resource",
  CodeGeneratorVersion = "feature-code-generator-version",
}
