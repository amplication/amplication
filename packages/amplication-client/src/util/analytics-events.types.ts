export enum AnalyticsEventNames {
  AppSessionStart = "startAppSession",

  // login and authentication
  ApiTokenCreate = "createApiToken",
  SignInWithGitHub = "signInWithGitHub",
  SignInWithUserName = "signInWithUserName",

  // account
  AccountInfoUpdate = "updateAccountInfo",

  // workspace
  WorkspaceInfoUpdate = "updateWorkspaceInfo",
  WorkspaceCreate = "createWorkspace",

  // members
  MemberInvite = "inviteUser",
  MemberInvitationResend = "resendInvitation",
  MemberInvitationRevoke = "revokeInvitation",
  MemberFromWorkspaceDelete = "deleteUserFromWorkspace",

  // menu
  SupportButtonClick = "supportButtonClick",
  SupportDocsClick = "supportDocsClick",
  SupportCommunityClick = "supportCommunityClick",
  SupportFeatureRequestClick = "supportFeatureRequestClick",
  SupportIssueClick = "supportIssueClick",
  ThemeSet = "setTheme",

  // tiles that exists in all kinds of resources (service, message broker, etc.)
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
  // TODO: ask about these names
  CodeViewTileClick = "viewCodeViewTileClick",
  GithubCodeViewClick = "openGithubCodeView",

  // GitHub
  GitHubAuthResourceStart = "startAuthResourceWithGitHub",
  GitHubAuthResourceComplete = "completeAuthResourceWithGitHub",
  GitHubRepositoryCreate = "createGitRepository",
  GithubRepositoryChange = "changeGithubRepository",
  GithubOpenPullRequest = "openGithubPullRequest",
  // TODO: ask about these names
  GitHubRepositorySync = "selectGitRepository",
  GithubRepoSync = "selectGithubRepo",
}
