// Admin Permissions
const AdminPermissions = ["*"] as const;

// Workspace Permissions
const WorkspacePermissions = [
  "workspace.member.invite",
  "workspace.member.remove",
  "workspace.settings.edit",
] as const;

// Team Permissions
const TeamPermissions = [
  "team.create",
  "team.delete",
  "team.edit",
  "team.member.add",
  "team.member.remove",
] as const;

// Properties Permissions
const PropertiesPermissions = [
  "property.create",
  "property.delete",
  "property.edit",
] as const;

// Git Organization Permissions
const GitOrganizationPermissions = [
  "git.org.create",
  "git.org.delete",
] as const;

const GitRepositoryPermissions = [
  "git.repo.settings.edit",
  "git.repo.create",
  "git.repo.disconnect",
  "git.repo.select",
] as const;

// Project Permissions
const ProjectPermissions = [
  "project.create",
  "project.delete",
  "project.settings.edit",
] as const;

// Resource Permissions
const ResourcePermissions = [
  "resource.*.edit", // (split later to specific)
  "resource.delete",
  "resource.create",
  "resource.createFromTemplate",
  "resource.createMessageBroker",
  "resource.createService",
  "resource.createTemplate",
] as const;

// Private Plugin Permissions
const PrivatePluginPermissions = [
  "privatePlugin.create",
  "privatePlugin.delete",
  "privatePlugin.edit",
  "privatePlugin.version.create",
  "privatePlugin.version.edit",
] as const;

const RolesPermissions = [
  ...AdminPermissions,
  ...GitOrganizationPermissions,
  ...GitRepositoryPermissions,
  ...PrivatePluginPermissions,
  ...ProjectPermissions,
  ...PropertiesPermissions,
  ...ResourcePermissions,
  ...TeamPermissions,
  ...WorkspacePermissions,
] as const;

export const rolesPermissionsList: string[] = [...RolesPermissions];

export type RolesPermissions = (typeof RolesPermissions)[number];
