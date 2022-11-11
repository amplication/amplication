/**
 * Resource types which be authorized by their identifier.
 * @remarks
 * Each parameter defined in the enum needs a definition of how to authorize it
 * in the { @link PermissionService }
 */
export enum AuthorizableOriginParameter {
  WorkspaceId,
  ResourceId,
  EntityId,
  EntityFieldId,
  EntityPermissionFieldId,
  BlockId,
  ResourceRoleId,
  BuildId,
  ActionId,
  EnvironmentId,
  DeploymentId,
  CommitId,
  ApiTokenId,
  GitOrganizationId,
  GitRepositoryId,
  InvitationId,
  ProjectId
}
