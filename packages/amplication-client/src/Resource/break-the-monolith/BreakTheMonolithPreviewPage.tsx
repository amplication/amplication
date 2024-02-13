import React from "react";
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
  EnumButtonStyle,
} from "@amplication/ui/design-system";
import { AppRouteProps } from "../../routes/routesUtil";
import ModelOrganizer from "../../Project/ArchitectureConsole/ModelOrganizer";
import { BtmButton, EnumButtonLocation } from "./BtmButton";

import "./BreakTheMonolithPreviewPage.scss";
const CLASS_NAME = "break-the-monolith-overview-page";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakTheMonolithPreviewPage: React.FC<Props> = ({ match }) => {
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  return (
    <Modal open fullScreen>
      <FlexItem
        className={CLASS_NAME}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
      >
        <div className={`${CLASS_NAME}__instructions-box`}>
          <div className={`${CLASS_NAME}__instructions-box__content`}>
            <Text
              textStyle={EnumTextStyle.H2}
              textWeight={EnumTextWeight.Bold}
              className={`${CLASS_NAME}__title`}
            >
              Breaking the chosen monolith
            </Text>
            <Text textColor={EnumTextColor.Black20}>
              Explore the entities of the selected open-source monolith. When
              ready to transform into microservices architecture, simply press
              the button.
            </Text>
            <Text textColor={EnumTextColor.Black20}>
              Note that Amplication can then generate the code for the
              architecture change, and push the code to your git repository.
            </Text>
          </div>
          <BtmButton
            location={EnumButtonLocation.PreviewBtm}
            openInFullScreen={false}
            autoRedirectAfterCompletion
            ButtonStyle={EnumButtonStyle.GradientFull}
          />
        </div>
        <ModelOrganizer restrictedMode />
      </FlexItem>
    </Modal>
  );
};

export default BreakTheMonolithPreviewPage;
