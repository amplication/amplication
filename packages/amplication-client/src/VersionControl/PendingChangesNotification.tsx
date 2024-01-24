import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "./PendingChangesNotification.scss";

import { AppContext } from "../context/appContext";

const CLASS_NAME = "pending-changes-notification";

const PendingChangesNotification = () => {
  const { currentWorkspace, currentProject, pendingChanges } =
    useContext(AppContext);

  if (isEmpty(pendingChanges)) return null;

  const message =
    pendingChanges.length === 1
      ? `There is ${pendingChanges.length} pending change`
      : `There are ${pendingChanges.length} pending changes`;

  return (
    <Panel
      className={CLASS_NAME}
      shadow={true}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <FlexItem itemsAlign={EnumItemsAlign.Center}>
        <FlexItem direction={EnumFlexDirection.Column}>
          <Text
            textStyle={EnumTextStyle.Tag}
            textColor={EnumTextColor.ThemeOrange}
          >
            {message}
          </Text>
          <Text textStyle={EnumTextStyle.Description}>
            You need to commit your changes to generate the code for your
            services
          </Text>
        </FlexItem>

        <FlexItem.FlexEnd>
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/pending-changes`}
          >
            <Button buttonStyle={EnumButtonStyle.Outline}>View changes</Button>
          </Link>
        </FlexItem.FlexEnd>
      </FlexItem>
    </Panel>
  );
};

export default PendingChangesNotification;
