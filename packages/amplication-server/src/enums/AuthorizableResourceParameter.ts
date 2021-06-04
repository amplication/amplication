/**
 * Resource types which be authorized by their identifier.
 * @remarks
 * Each parameter defined in the enum needs a definition of how to authorize it
 * in the { @link PermissionService }
 */
export enum AuthorizableResourceParameter {
  WorkspaceId,
  AppId,
  EntityId,
  EntityFieldId,
  EntityPermissionFieldId,
  BlockId,
  AppRoleId,
  BuildId,
  ActionId,
  EnvironmentId,
  DeploymentId,
  CommitId,
  ApiTokenId
}
