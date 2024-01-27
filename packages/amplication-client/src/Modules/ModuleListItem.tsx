import {
  Button,
  ClickableListItemWithInnerActions,
  EnumButtonStyle,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  module: models.Module;
};

export const ModuleListItem = ({ module }: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const moduleUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}`;
  const editUrl = `${moduleUrl}/edit`;
  const actionsUrl = `${moduleUrl}/actions`;
  const dtosUrl = `${moduleUrl}/dtos`;

  return (
    <ClickableListItemWithInnerActions
      to={editUrl}
      endAction={
        <FlexItem>
          <NavLink to={actionsUrl}>
            <Button buttonStyle={EnumButtonStyle.Text}>
              <Icon icon="api" size="xsmall" />
            </Button>
          </NavLink>
          <NavLink to={dtosUrl}>
            <Button buttonStyle={EnumButtonStyle.Text}>
              <Icon icon="zap" size="xsmall" />
            </Button>
          </NavLink>
        </FlexItem>
      }
    >
      <Text textStyle={EnumTextStyle.Description}>{module.displayName}</Text>
    </ClickableListItemWithInnerActions>
  );
};
