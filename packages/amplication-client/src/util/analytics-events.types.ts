export enum AnalyticsEventNames {
  // menu
  SupportButtonClick = "supportButtonClick",
  SupportDocsClick = "supportDocsClick",
  SupportCommunityClick = "supportCommunityClick",
  SupportFeatureRequestClick = "supportFeatureRequestClick",
  SupportIssueClick = "supportIssueClick",
  CheckoutPlanSelected = "checkoutPlanSelected",
  ThemeSet = "setTheme",

  // tiles that exists in all kinds of resources (service, message broker, etc.)
  DocsTileClick = "docsTileClick",
  FeatureRequestTileClick = "featureRequestTileClick",
  NewVersionTileFixEntitiesClick = "newVersionTileClick-fixEntities",
  RolesTileClick = "rolesTileClick",

  // entity
  EntityCreate = "createEntity",
  EntityUpdate = "updateEntity",
  EntityFieldCreate = "createEntityField",
  EntityFieldUpdate = "updateEntityField",
  RelatedEntityFix = "fixRelatedEntity",
  EntitiesTileClick = "entitiesTileClick",

  // account
  AccountInfoUpdate = "updateAccountInfo",

  // project configuration
  ProjectConfigurationsSettingsUpdate = "updateProjectConfigurationsSettings",

  // project
  ProjectCreate = "createProject",

  // service
  ServiceSettingsUpdate = "updateServiceSettings",

  // resource
  ResourceFromFileCreate = "createResourceFromFile",
  ResourceFromSampleCreate = "createResourceFromSample",
  ResourceFromScratchCreate = "createResourceFromScratch",
  ResourceInfoUpdate = "updateResourceInfo",

  // message broker
  MessageBrokerConnectedServicesTileClick = "messageBrokerConnectedServicesTileClick",
  MessageBrokerTopicsTileClick = "messageBrokerTopicsTileClick",

  // topic

  // schema
  FileToImportSchemaUpload = "uploadFileToImportSchema",

  // code view
  CodeViewTileClick = "viewCodeViewTileClick",
}
