import React, { useCallback } from "react";
import { match } from "react-router-dom";
import {
  Text,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Modal,
  EnumTextColor,
  EnumTextWeight,
  Button,
} from "@amplication/ui/design-system";
import { AppRouteProps } from "../../routes/routesUtil";
import ModelOrganizer from "../../Project/ArchitectureConsole/ModelOrganizer";

import "./BreakTheMonolithOverviewPage.scss";
const CLASS_NAME = "break-the-monolith-overview-page";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakTheMonolithOptionsPage: React.FC<Props> = ({ match }) => {
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  const handleBreakTheMonolithClicked = useCallback(() => {
    // call ai
    // prepare data for useModelOrganizer
    // redirect to architecture page in redesign mode
  }, []);

  return (
    <Modal open fullScreen>
      <FlexItem
        className={CLASS_NAME}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
      >
        <div className={`${CLASS_NAME}__instructions`}>
          <Text
            textStyle={EnumTextStyle.H2}
            textWeight={EnumTextWeight.Bold}
            className={`${CLASS_NAME}__title`}
          >
            Breaking the chosen monolith
          </Text>
          <Text textColor={EnumTextColor.Black20}>
            Explore the entities of the selected open-source monolith. When
            ready to transform into microservices architecture, simply press the
            button.
          </Text>
          <Text textColor={EnumTextColor.Black20}>
            Note that Amplication can then generate the code for the
            architecture change, and push the code to your git provider" Button:
            "Break the monolith.
          </Text>
          <Button
            className={`${CLASS_NAME}__break-btn`}
            onClick={handleBreakTheMonolithClicked}
          >
            Break the monolith
          </Button>
        </div>
        <ModelOrganizer />
      </FlexItem>
    </Modal>
  );
};

export default BreakTheMonolithOptionsPage;
