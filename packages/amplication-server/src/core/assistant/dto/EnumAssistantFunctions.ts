import { registerEnumType } from "@nestjs/graphql";

export enum EnumAssistantFunctions {
  CreateEntities = "createEntities",
  CreateEntityFields = "createEntityFields",
  GetProjectResources = "getProjectResources",
  GetResourceEntities = "getResourceEntities",
  CreateResource = "createResource",
  CreateProject = "createProject",
  CommitProjectPendingChanges = "commitProjectPendingChanges",
  GetProjectPendingChanges = "getProjectPendingChanges",
  GetAvailablePlugins = "getAvailablePlugins",
  InstallPlugins = "installPlugins",
  GetResourceModules = "getResourceModules",
  GetResource = "getResource",
  CreateModule = "createModule",
  GetModuleDtosAndEnums = "getModuleDtosAndEnums",
  CreateModuleDto = "createModuleDto",
  CreateModuleEnum = "createModuleEnum",
  GetModuleActions = "getModuleActions",
  CreateModuleAction = "createModuleAction",
  CreateBlueprint = "createBlueprint",
  ListBlueprints = "listBlueprints",
  GetProjects = "getProjects",

  //get templates
  //create resource from template
  //create template
}

registerEnumType(EnumAssistantFunctions, {
  name: "EnumAssistantFunctions",
});
