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

// Project Permissions
const ProjectPermissions = [
  "project.create",
  "project.delete",
  "project.git.repo.baseBranch.edit",
  "project.git.repo.create",
  "project.git.repo.disconnect",
  "project.git.repo.select",
  "project.platformSettings.edit",
  "project.settings.edit",
] as const;

// Resource Permissions
const ResourcePermissions = [
  "resource.*.edit", // (split later to specific)
  "resource.git.repo.baseBranch.edit",
  "resource.git.repo.create",
  "resource.git.repo.disconnect",
  "resource.git.repo.overrideProjectSettings",
  "resource.git.repo.select",
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
  "privatePlugin.git.repo.baseBranch.edit",
  "privatePlugin.git.repo.create",
  "privatePlugin.git.repo.disconnect",
  "privatePlugin.git.repo.overrideProjectSettings",
  "privatePlugin.git.repo.select",
  "privatePlugin.version.create",
  "privatePlugin.version.edit",
] as const;

const RolesPermissions = [
  ...AdminPermissions,
  ...GitOrganizationPermissions,
  ...PrivatePluginPermissions,
  ...ProjectPermissions,
  ...PropertiesPermissions,
  ...ResourcePermissions,
  ...TeamPermissions,
  ...WorkspacePermissions,
] as const;

export const rolesPermissionsList: string[] = [...RolesPermissions];

export type RolesPermissions = (typeof RolesPermissions)[number];
