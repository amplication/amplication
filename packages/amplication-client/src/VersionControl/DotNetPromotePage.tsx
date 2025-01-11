import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Modal,
  Text,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { TitleAndIcon } from "../Components/TitleAndIcon";
import { useContactUs } from "../Workspaces/hooks/useContactUs";
import dotnetLogo from "../assets/images/dotnet-logo.svg";
import { useAppContext } from "../context/appContext";
import "./DotnetPromotePage.scss";
import { EnumSubscriptionStatus } from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CLASS_NAME = "dotnet-promote-page";
const eventOriginLocationName = "dotnet-promote-page";

const DotNetPromotePage = () => {
  const { currentWorkspace, currentProject } = useAppContext();
  const { trackEvent } = useTracking();
  const { baseUrl } = useProjectBaseUrl();

  const { handleContactUsClick } = useContactUs({
    actionName: "Contact Us",
    eventOriginLocation: eventOriginLocationName,
  });

  const history = useHistory();

  const handleCloseClicked = useCallback(() => {
    history.push(`${baseUrl}`);
  }, [history, baseUrl]);

  const handleUpgradeClick = useCallback(() => {
    window.open(`/${currentWorkspace?.id}/purchase`, "_blank");
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: eventOriginLocationName,
    });
  }, [currentWorkspace, trackEvent]);

  return (
    <Modal open fullScreen showCloseButton onCloseEvent={handleCloseClicked}>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__content`}>
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
            margin={EnumFlexItemMargin.Top}
            itemsAlign={EnumItemsAlign.Center}
          >
            <img src={dotnetLogo} alt=".NET" width={150} />

            <FlexItem
              margin={EnumFlexItemMargin.Top}
              gap={EnumGapSize.Large}
              direction={EnumFlexDirection.Column}
              itemsAlign={EnumItemsAlign.Stretch}
            >
              <Text
                textStyle={EnumTextStyle.Normal}
                textColor={EnumTextColor.Black20}
                textAlign={EnumTextAlign.Center}
                className={`${CLASS_NAME}__sub-title`}
              >
                {currentWorkspace?.subscription?.status ===
                EnumSubscriptionStatus.Trailing ? (
                  <>
                    The trial plan does not include the option to generate code
                    in .NET. However, you have a few alternatives:
                  </>
                ) : (
                  <>
                    Your plan does not include the option to generate code in
                    .NET. However, you have a few alternatives:
                  </>
                )}
              </Text>

              <List
                listStyle={EnumListStyle.Dark}
                themeColor={EnumTextColor.ThemeBlue}
              >
                <ListItem
                  onClick={handleContactUsClick}
                  direction={EnumFlexDirection.Column}
                  gap={EnumGapSize.Large}
                  end={
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.ThemeBlue}
                    >
                      Talk to Us
                    </Text>
                  }
                >
                  <TitleAndIcon icon={"calendar"} title={"Talk to Us"} />
                  <Text textStyle={EnumTextStyle.Tag}>
                    Contact us to schedule a demo of our .NET capabilities and
                    see how it can benefit your projects.
                  </Text>
                </ListItem>
              </List>
              <List
                listStyle={EnumListStyle.Dark}
                themeColor={EnumTextColor.ThemeGreen}
              >
                <ListItem
                  onClick={handleUpgradeClick}
                  direction={EnumFlexDirection.Column}
                  gap={EnumGapSize.Large}
                  end={
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.ThemeGreen}
                    >
                      Upgrade
                    </Text>
                  }
                >
                  <TitleAndIcon icon={"briefcase"} title={"Upgrade"} />
                  <Text textStyle={EnumTextStyle.Tag}>
                    Visit our pricing page to upgrade to the full Essential plan
                    and unlock .NET code generation along with other premium
                    features.
                  </Text>
                </ListItem>
              </List>
              <List
                listStyle={EnumListStyle.Dark}
                themeColor={EnumTextColor.Primary}
              >
                <ListItem
                  onClick={handleCloseClicked}
                  direction={EnumFlexDirection.Column}
                  gap={EnumGapSize.Large}
                  end={
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.Primary}
                    >
                      Keep Exploring Amplication
                    </Text>
                  }
                >
                  <TitleAndIcon
                    icon={"logo"}
                    title={"Keep Exploring Amplication"}
                  />
                  <Text textStyle={EnumTextStyle.Tag}>
                    Continue working and generate code in Node.js to explore and
                    understand Amplication's capabilities
                    {currentWorkspace?.subscription?.status ===
                    EnumSubscriptionStatus.Trailing
                      ? " during the trial period"
                      : ""}
                    .
                  </Text>
                </ListItem>
              </List>
            </FlexItem>
          </FlexItem>
        </div>
      </div>
    </Modal>
  );
};

export default DotNetPromotePage;
