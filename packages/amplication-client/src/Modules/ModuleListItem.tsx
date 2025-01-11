import {
  Button,
  ClickableListItemWithInnerActions,
  EnumButtonStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { NavLink } from "react-router-dom";
import { REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED } from "../env";
import * as models from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  module: models.Module;
};

export const ModuleListItem = ({ module }: Props) => {
  const { baseUrl } = useResourceBaseUrl();

  if (!module) return null;

  const moduleUrl = `${baseUrl}/modules/${module.id}`;
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
          {REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED === "true" && (
            <NavLink to={dtosUrl}>
              <Button buttonStyle={EnumButtonStyle.Text}>
                <Icon icon="zap" size="xsmall" />
              </Button>
            </NavLink>
          )}
        </FlexItem>
      }
    >
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {module.displayName}
      </Text>
    </ClickableListItemWithInnerActions>
  );
};
