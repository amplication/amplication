import { registerEnumType } from "@nestjs/graphql";

export enum EnumAssistantFunctions {
  CreateEntity = "createEntity",
  GetProjectServices = "getProjectServices",
  GetServiceEntities = "getServiceEntities",
  CreateService = "createService",
  CreateProject = "createProject",
  CommitProjectPendingChanges = "commitProjectPendingChanges",
  GetProjectPendingChanges = "getProjectPendingChanges",
  GetPlugins = "getPlugins",
  InstallPlugins = "installPlugins",
  GetServiceModules = "getServiceModules",
  CreateModule = "createModule",
  GetModuleDtosAndEnums = "getModuleDtosAndEnums",
  CreateModuleDto = "createModuleDto",
  CreateModuleEnum = "createModuleEnum",
  GetModuleActions = "getModuleActions",
  CreateModuleAction = "createModuleAction",
}

registerEnumType(EnumAssistantFunctions, {
  name: "EnumAssistantFunctions",
});
