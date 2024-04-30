import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Icon,
  Modal,
  Text,
} from "@amplication/ui/design-system";
import "./DotnetPromotePage.scss";
import { DotNetPromoteOptions } from "./DotNetPromoteOptions";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useCallback } from "react";

const CLASS_NAME = "dotnet-promote-page";

const DotNetPromotePage = () => {
  const { currentWorkspace, currentProject } = useAppContext();
  const history = useHistory();

  const handleCloseClicked = useCallback(() => {
    history.push(`/${currentWorkspace?.id}/${currentProject?.id}`);
  }, [history, currentProject, currentWorkspace]);
  return (
    <Modal open fullScreen>
      <div className={CLASS_NAME}>
        <Button
          className={`${CLASS_NAME}__close`}
          buttonStyle={EnumButtonStyle.Text}
          onClick={handleCloseClicked}
        >
          <Icon icon="close" size="xsmall"></Icon>
          Close
        </Button>

        <div className={`${CLASS_NAME}__content`}>
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
            margin={EnumFlexItemMargin.Top}
            itemsAlign={EnumItemsAlign.Center}
          >
            <Text textStyle={EnumTextStyle.H1}>Amplication .Net</Text>
            <Text textStyle={EnumTextStyle.H3}>
              Amplication now supports .NET projects, offering lightning-fast
              code generation for your backend needs. Trusted by thousands of
              Node.js developers, our platform ensures speed, reliability, and
              scalability. Whether it's for personal projects, startups, or
              enterprises, we've got you covered!
            </Text>
            <Text>
              Could you please let us know your preferred usage scenario?
            </Text>
            <DotNetPromoteOptions />
          </FlexItem>
        </div>
      </div>
    </Modal>
  );
};

export default DotNetPromotePage;
