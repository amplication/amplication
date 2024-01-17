/**
 * Analytics events documentation:
 * https://www.notion.so/amplication/Amplication-Analytics-Events-74684bfd1a3a4e13a8a6ec6c253d3d7f
 */

export enum AnalyticsEventNames {
  AppSessionStart = "startAppSession",

  // login and authentication
  ApiTokenCreate = "createApiToken",
  SignInWithGitHub = "signInWithGitHub",
  SignInWithUserName = "signInWithUserName",
  ContinueWithSSOClick = "continueWithSSOClick",
  SignUpWithEmailPassword = "SignUpWithEmailPassword",
  EmailLogin = "EmailLogin",

  // account
  AccountInfoUpdate = "updateAccountInfo",

  // workspace
  WorkspaceSelected = "selectWorkspace",
  WorkspaceInfoUpdate = "updateWorkspaceInfo",
  WorkspaceCreate = "createWorkspace",
  WorkspaceMemberInvite = "inviteUser",
  WorkspaceMemberInvitationResend = "resendInvitation",
  WorkspaceMemberInvitationRevoke = "revokeInvitation",
  WorkspaceMemberFromWorkspaceDelete = "deleteUserFromWorkspace",

  // menu
  SupportButtonClick = "supportButtonClick",
  SupportDocsClick = "supportDocsClick",
  SupportCommunityClick = "supportCommunityClick",
  SupportFeatureRequestClick = "supportFeatureRequestClick",
  SupportIssueClick = "supportIssueClick",
  MenuItemClick = "menuItemClick",
  ThemeSet = "setTheme",

  // tiles
  DocsTileClick = "docsTileClick",
  FeatureRequestTileClick = "featureRequestTileClick",
  NewVersionTileFixEntitiesClick = "newVersionTileClick-fixEntities",
  RolesTileClick = "rolesTileClick",

  // project & project configuration
  ProjectConfigurationsSettingsUpdate = "updateProjectConfigurationsSettings",
  ProjectCreate = "createProject",
  ProjectDelete = "deleteProject",

  // service
  ServiceSettingsUpdate = "updateServiceSettings",

  // resource
  ResourceFromFileCreate = "createResourceFromFile",
  ResourceFromSampleCreate = "createResourceFromSample",
  ResourceFromScratchCreate = "createResourceFromScratch",
  ResourceInfoUpdate = "updateResourceInfo",
  ResourceBuild = "buildResource",
  ResourceDelete = "deleteResource",
  ResourceCardClick = "resourceCardClick",
  MessageBrokerCreate = "createResourceClick-MessageBroker",
  ProjectConfigurationCreate = "createResourceClick-ProjectConfiguration",
  ServiceCreate = "createResourceClick-Service",

  // entity

  RelatedEntityFix = "fixRelatedEntity",
  EntitiesTileClick = "entitiesTileClick",
  PluginsTileClick = "pluginsTileClick",
  ImportPrismaSchemaClick = "importPrismaSchemaClick",
  ImportPrismaSchemaJoinBetaClick = "importPrismaSchemaJoinBetaClick",
  ImportPrismaSchemaSelectFile = "importPrismaSchemaSelectFile",

  // message broker
  MessageBrokerConnectedServicesTileClick = "messageBrokerConnectedServicesTileClick",
  MessageBrokerTopicsTileClick = "messageBrokerTopicsTileClick",
  MessageBrokerErrorCreate = "messageBrokerErrorCreate",
  MessageBrokerCreateClick = "createMessageBrokerClick",
  MessagePatternTypeClick = "messagePatternTypeClick",
  BackToProjectsClick = "backToProjectsClick",

  // topic
  TopicCreate = "createTopic",
  TopicUpdate = "updateTopic",

  // commit & build & pending changes
  CommitClicked = "commitClicked",
  CommitListBuildIdClick = "commitListBuildIdClick",
  LastCommitIdClick = "lastCommitIdClick",
  PendingChangesDiscard = "discardPendingChanges",
  LastBuildIdClick = "lastBuildIdClick",

  // code view
  CodeViewTileClick = "viewCodeViewTileClick",
  GithubCodeViewClick = "openGithubCodeView",

  // git provider
  GitProviderConnectClick = "addGitProviderClick",
  GitProviderCustomBaseBranch = "GitProviderCustomBaseBranch",

  // GitHub
  GitHubAuthResourceStart = "startAuthResourceWithGitHub",
  GitHubRepositoryCreate = "createGitRepository",
  GithubRepositoryChange = "changeGithubRepository",
  GithubOpenPullRequest = "openGithubPullRequest",
  GitHubRepositorySync = "selectGitRepository",
  GithubRepoSync = "selectGithubRepo",
  CreateService = "CreateService",
  CreateMessageBroker = "CreateMessageBroker",
  CreateProjectConfiguration = "CreateProjectConfiguration",
  StarUsBannerCTAClick = "StarUsBannerCTAClick",
  StarUsBannerClose = "StarUsBannerClose",

  // Purchase Page
  PricingPageClose = "PricingPageClose",
  PricingPageCTAClick = "PricingPageCTAClick",
  PassedLimitsNotificationClose = "PassedLimitsNotificationClose",
  PricingPageChangeBillingCycle = "PricingPageChangeBillingCycle",
  PricingPageChangeWorkspace = "PricingPageChangeWorkspace",
  ProFeatureLockClick = "ProFeatureLockClick",
  ContactUsButtonClick = "ContactUsButtonClick",

  // upgrade
  UpgradeClick = "UpgradeClick",
  UpgradeLaterClick = "UpgradeLaterClick",

  // Chat widget
  HelpMenuItemClick = "HelpMenuItemClick",
  ChatWidgetView = "ChatWidgetView",
  ChatWidgetClose = "ChatWidgetClose",

  // wizard
  ViewServiceWizardStep_Welcome = "viewServiceWizardStep_Welcome",
  ServiceWizardStep_Welcome_CTAClick = "ServiceWizardStep_Welcome_CTAClick",
  ViewServiceWizardStep_Name = "ViewServiceWizardStep_Name",
  ViewServiceWizardStep_Git = "ViewServiceWizardStep_Git",
  ViewServiceWizardStep_APISettings = "ViewServiceWizardStep_APISettings",
  ViewServiceWizardStep_RepoSettings = "ViewServiceWizardStep_RepoSettings",
  ViewServiceWizardStep_DBSettings = "ViewServiceWizardStep_DBSettings",
  ViewServiceWizardStep_EntitiesSettings = "ViewServiceWizardStep_EntitiesSettings",
  ViewServiceWizardStep_AuthSettings = "ViewServiceWizardStep_AuthSettings",
  ViewServiceWizardStep_CodeGeneration = "ViewServiceWizardStep_CodeGeneration",
  ServiceWizardStep_CodeReady = "ServiceWizardStep_CodeReady",
  ServiceWizardStep_ViewCodeClicked = "ServiceWizardStep_ViewCodeClicked",
  ViewServiceWizardStep_Finish = "ViewServiceWizardStep_Finish",
  ServiceWizard_ServiceGenerated = "ServiceWizard_ServiceGenerated",
  ServiceWizardStep_ContinueClicked = "ServiceWizardStep_ContinueClicked",
  ServiceWizardStep_BackClicked = "ServiceWizardStep_BackClicked",
  ServiceWizardStep_CloseClicked = "ServiceWizardStep_CloseClicked",
  ServiceWizardStep_Finish_CTAClicked = "ServiceWizardStep_Finish_CTAClicked",
  ServiceWizardStep_CloseClick = "ServiceWizardStep_CloseClick",
  ViewServiceWizardError = "ViewServiceWizardError",
  ServiceWizardError_TryAgain = "ServiceWizardError_TryAgain",
  ServiceWizardError_Continue = "ServiceWizardError_Continue",

  // notification
  OpenNotificationCenter = "OpenNotificationCenter",
  ClickNotificationMessage = "ClickNotificationMessage",
}
