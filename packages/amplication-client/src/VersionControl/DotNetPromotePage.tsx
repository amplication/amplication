import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
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
import dotnetLogo from "../assets/images/dotnet-logo.svg";

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
            <img src={dotnetLogo} alt=".NET" width={150} />

            <Text
              textStyle={EnumTextStyle.Normal}
              textColor={EnumTextColor.Black20}
              textAlign={EnumTextAlign.Center}
              className={`${CLASS_NAME}__sub-title`}
            >
              <p>
                Amplication now supports .NET projects, offering lightning-fast
                code generation for your backend needs.
              </p>
              <p>
                Trusted by thousands of Node.js developers, our platform ensures
                speed, reliability, and scalability. Whether it's for personal
                projects, startups, or enterprises, we've got you covered!
              </p>
            </Text>

            <DotNetPromoteOptions />
          </FlexItem>
        </div>
      </div>
    </Modal>
  );
};

export default DotNetPromotePage;
