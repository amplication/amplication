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
  EntityCreate = "createEntity",
  EntityUpdate = "updateEntity",
  EntityFieldCreate = "createEntityField",
  EntityFieldUpdate = "updateEntityField",
  RelatedEntityFix = "fixRelatedEntity",
  EntitiesTileClick = "entitiesTileClick",

  // message broker
  MessageBrokerConnectedServicesTileClick = "messageBrokerConnectedServicesTileClick",
  MessageBrokerTopicsTileClick = "messageBrokerTopicsTileClick",
  MessageBrokerErrorCreate = "messageBrokerErrorCreate",
  MessageBrokerCreateClick = "createMessageBrokerClick",
  MessagePatternTypeClick = "messagePatternTypeClick",
  BackToProjectsClick = "backToProjectsClick",

  // topic
  TopicCreate = "topicCreate",
  TopicCreateFailed = "topicCreateFailed",
  TopicNameEdit = "topicNameEdit",
  TopicDisplayNameEdit = "topicDisplayNameEdit",
  TopicDescriptionEdit = "topicDescriptionEdit",
  TopicsSearch = "topicsSearch",

  // commit & build & pending changes
  CommitCreate = "commit",
  CommitListBuildIdClick = "commitListBuildIdClick",
  LastCommitIdClick = "lastCommitIdClick",
  PendingChangesDiscard = "discardPendingChanges",
  LastBuildIdClick = "lastBuildIdClick",

  // code view
  CodeViewTileClick = "viewCodeViewTileClick",
  GithubCodeViewClick = "openGithubCodeView",

  // GitHub
  GitHubAuthResourceStart = "startAuthResourceWithGitHub",
  GitHubAuthResourceComplete = "completeAuthResourceWithGitHub",
  GitHubRepositoryCreate = "createGitRepository",
  GithubRepositoryChange = "changeGithubRepository",
  GithubOpenPullRequest = "openGithubPullRequest",
  GitHubRepositorySync = "selectGitRepository",
  GithubRepoSync = "selectGithubRepo",
  CreateService = "CreateService",
  CreateMessageBroker = "CreateMessageBroker",
  CreateProjectConfiguration = "CreateProjectConfiguration",

  // new event for startAuthResourceWithGitHub
  AddGitProviderClick = "addGitProviderClick",

  // Purchase Page
  PricingPageClose = "PricingPageClose",
  PricingPageCTAClick = "PricingPageCTAClick",
  PassedLimitsNotificationView = "PassedLimitsNotificationView",
  PassedLimitsNotificationClose = "PassedLimitsNotificationClose",
  PricingPageChangeBillingCycle = "PricingPageChangeBillingCycle",
  UpgradeOnResourceListClick = "UpgradeOnResourceListClick",
  UpgradeOnEntityListClick = "UpgradeOnEntityListClick",
  UpgradeOnPassedLimitsClick = "UpgradeOnPassedLimitsClick",
  PricingPageChangeWorkspace = "PricingPageChangeWorkspace",
  UpgradeOnTopBarClick = "UpgradeOnTopBarClick",
  ContactUsButtonClick = "ContactUsButtonClick",

  // Chat widget
  HelpMenuItemClick = "HelpMenuItemClick",
  ChatWidgetView = "ChatWidgetView",
  ChatWidgetClose = "ChatWidgetClose",
}
