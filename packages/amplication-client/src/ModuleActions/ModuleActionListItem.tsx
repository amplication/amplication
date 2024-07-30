import {
  ApiOperationTag,
  ClickableListItemWithInnerActions,
  EnumApiOperationTagStyle,
  EnumGqlApiOperationTagType,
  EnumRestApiOperationTagType,
  EnumTextColor,
  EnumTextStyle,
  EnumToggleStyle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { kebabCase } from "lodash";
import { useCallback, useContext } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import useModuleAction from "./hooks/useModuleAction";

type Props = {
  module: models.Module;
  moduleAction: models.ModuleAction;
  tagStyle: EnumApiOperationTagStyle;
  disabled?: boolean;
};

const REST_VERB_TO_API_OPERATION: {
  [key in models.EnumModuleActionRestVerb]: EnumRestApiOperationTagType;
} = {
  [models.EnumModuleActionRestVerb.Get]: EnumRestApiOperationTagType.Get,
  [models.EnumModuleActionRestVerb.Post]: EnumRestApiOperationTagType.Post,
  [models.EnumModuleActionRestVerb.Put]: EnumRestApiOperationTagType.Put,
  [models.EnumModuleActionRestVerb.Patch]: EnumRestApiOperationTagType.Patch,
  [models.EnumModuleActionRestVerb.Delete]: EnumRestApiOperationTagType.Delete,
  [models.EnumModuleActionRestVerb.Head]: EnumRestApiOperationTagType.Head,
  [models.EnumModuleActionRestVerb.Options]:
    EnumRestApiOperationTagType.Options,
  [models.EnumModuleActionRestVerb.Trace]: EnumRestApiOperationTagType.Trace,
};

const GQL_OPERATION_TO_API_OPERATION: {
  [key in models.EnumModuleActionGqlOperation]: EnumGqlApiOperationTagType;
} = {
  [models.EnumModuleActionGqlOperation.Mutation]:
    EnumGqlApiOperationTagType.Mutation,
  [models.EnumModuleActionGqlOperation.Query]: EnumGqlApiOperationTagType.Query,
};

export const ModuleActionListItem = ({
  module,
  moduleAction,
  tagStyle,
  disabled,
}: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const { updateModuleAction } = useModuleAction();

  const onEnableChanged = useCallback(
    (value: boolean) => {
      updateModuleAction({
        variables: {
          where: {
            id: moduleAction.id,
          },
          data: {
            enabled: value,
          },
        },
      }).catch(console.error);
    },
    [updateModuleAction, moduleAction]
  );

  if (!module) return null;

  const actionUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/actions/${moduleAction.id}`;

  return (
    <ClickableListItemWithInnerActions
      to={actionUrl}
      startAction={
        <Toggle
          toggleStyle={EnumToggleStyle.Green}
          name={"enabled"}
          onValueChange={onEnableChanged}
          checked={moduleAction.enabled}
          disabled={disabled}
        ></Toggle>
      }
    >
      <ApiOperationTag
        apiTagOperation={
          tagStyle === EnumApiOperationTagStyle.REST
            ? REST_VERB_TO_API_OPERATION[moduleAction.restVerb]
            : GQL_OPERATION_TO_API_OPERATION[moduleAction.gqlOperation]
        }
      />
      {tagStyle === EnumApiOperationTagStyle.REST && (
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          /api/{kebabCase(module.name)}
          {moduleAction.path}
        </Text>
      )}

      <Text textStyle={EnumTextStyle.Description}>
        {moduleAction.displayName}
      </Text>
    </ClickableListItemWithInnerActions>
  );
};
