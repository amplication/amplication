export enum AnalyticsEventNames {
  // menu
  SupportButtonClick = "supportButtonClick",
  SupportDocsClick = "supportDocsClick",
  SupportCommunityClick = "supportCommunityClick",
  SupportFeatureRequestClick = "supportFeatureRequestClick",
  SupportIssueClick = "supportIssueClick",
  CheckoutPlanSelected = "checkoutPlanSelected",
  ThemeSet = "setTheme",

  // tiles
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

  // project
  ProjectCreate = "createProject",

  // resource
  ResourceFromFileCreate = "createResourceFromFile",
  ResourceFromSampleCreate = "createResourceFromSample",
  ResourceFromScratchCreate = "createResourceFromScratch",
  ResourceInfoUpdate = "updateResourceInfo",

  // message broker and topic

  // schema
  FileToImportSchemaUpload = "uploadFileToImportSchema",
}
