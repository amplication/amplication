import {
  EnumModuleActionType,
  EnumModuleDtoType,
  ModuleAction,
} from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";

function getDefaultAction(
  entityName: string,
  actionType: EnumModuleActionType
): ModuleAction {
  const context = DsgContext.getInstance;

  return context.entityActionsMap[entityName].entityDefaultActions[actionType];
}

export function getDefaultModuleActionName(
  entityName: string,
  actionType: EnumModuleActionType
) {
  const action = getDefaultAction(entityName, actionType);

  return action.name;
}

export function getDefaultModuleDtoName(
  entityName: string,
  dtoType: EnumModuleDtoType
) {
  const context = DsgContext.getInstance;

  const dto = context.moduleActionsAndDtoMap[entityName].dtos.find(
    (dto) => dto.dtoType === dtoType
  );

  return dto?.name;
}
