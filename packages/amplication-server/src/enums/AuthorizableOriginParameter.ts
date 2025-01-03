/**
 * Resource types which be authorized by their identifier.
 * @remarks
 * Each parameter defined in the enum needs a definition of how to authorize it
 * in the { @link PermissionService }
 */
export enum AuthorizableOriginParameter {
  None,
  WorkspaceId,
  ResourceId,
  EntityId,
  EntityFieldId,
  EntityPermissionFieldId,
  BlockId,
  ResourceRoleId,
  BuildId,
  ResourceVersionId,
  ActionId,
  EnvironmentId,
  DeploymentId,
  CommitId,
  ApiTokenId,
  GitOrganizationId,
  GitRepositoryId,
  InvitationId,
  ProjectId,
  UserActionId,
  OutdatedVersionAlertId,
  TeamId,
  CustomPropertyId,
  BlueprintId,
  RoleId,
  UserId,
}
