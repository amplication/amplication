export enum BillingPlan {
  Free = "plan-amplication-free",
  Pro = "plan-amplication-pro",
  Enterprise = "plan-amplication-enterprise",
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
  TeamMembers = "feature-team-members",
}
