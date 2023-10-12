import {
  EnumFlexDirection,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { DeleteModuleAction } from "./DeleteModuleAction";

type Props = {
  moduleId: string;
  moduleAction: models.ModuleAction;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const ModuleActionListItem = ({
  moduleId,
  moduleAction,
  onDelete,
  onError,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const actionUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${moduleId}/actions/${moduleAction.id}`;

  const handleRowClick = useCallback(() => {
    history.push(actionUrl);
  }, [
    history,
    currentWorkspace,
    currentProject,
    currentResource,
    moduleId,
    moduleAction,
  ]);

  return (
    <ListItem onClick={handleRowClick}>
      <FlexItem
        start={
          <FlexItem direction={EnumFlexDirection.Row}>
            <Icon
              className="amp-data-grid-item__icon"
              icon={"box"}
              size="xsmall"
            />
            <Link title={moduleAction.displayName} to={actionUrl}>
              <Text>{moduleAction.displayName}</Text>
            </Link>
            <Text textColor={EnumTextColor.ThemeTurquoise}>
              {moduleAction.name}
            </Text>
          </FlexItem>
        }
        end={
          <DeleteModuleAction moduleAction={moduleAction} onDelete={onDelete} />
        }
      />

      {!isEmpty(moduleAction.description) && (
        <Text textStyle={EnumTextStyle.Description}>
          {moduleAction.description}
        </Text>
      )}
    </ListItem>
  );
};
