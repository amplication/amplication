import {
  ApiOperationTag,
  EnumApiOperationTagStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumGqlApiOperationTagType,
  EnumItemsAlign,
  EnumRestApiOperationTagType,
  EnumTextColor,
  EnumTextStyle,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { kebabCase } from "lodash";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  module: models.Module;
  moduleAction: models.ModuleAction;
  tagStyle: EnumApiOperationTagStyle;
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
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const actionUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/actions/${moduleAction.id}`;

  return (
    <ListItem
      to={actionUrl}
      showDefaultActionIcon={true}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
      start={
        <ApiOperationTag
          gqlTagType={GQL_OPERATION_TO_API_OPERATION[moduleAction.gqlOperation]}
          restTagType={REST_VERB_TO_API_OPERATION[moduleAction.restVerb]}
          tagStyle={tagStyle}
        />
      }
    >
      <Text textStyle={EnumTextStyle.Normal} textColor={EnumTextColor.White}>
        /api/{kebabCase(module.name)}
        {moduleAction.path}
      </Text>
      <Text textStyle={EnumTextStyle.Description}>
        {moduleAction.displayName}
      </Text>
    </ListItem>
  );
};
