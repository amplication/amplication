import {
  Breadcrumbs,
  Dialog,
  Icon,
  Tooltip,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useApolloClient } from "@apollo/client";
import {
  ButtonTypeEnum,
  IMessage,
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useCallback, useContext, useState } from "react";
import { isMacOs } from "react-device-detect";
import { Link } from "react-router-dom";
import AskJovuButton from "../../Assistant/AskJovuButton";
import ConsoleNavigationButton from "../../Assistant/ConsoleNavigationButton";
import CommandPalette from "../../CommandPalette/CommandPalette";
import { Button, EnumButtonStyle } from "../../Components/Button";
import UserBadge from "../../Components/UserBadge";
import BreadcrumbsContext from "../../Layout/BreadcrumbsContext";
import ProfileForm from "../../Profile/ProfileForm";
import NoNotifications from "../../assets/images/no-notification.svg";
import { unsetToken } from "../../authentication/authentication";
import { AppContext } from "../../context/appContext";
import {
  REACT_APP_AUTH_LOGOUT_URI,
  REACT_APP_NOVU_IDENTIFIER,
} from "../../env";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import useFetchGithubStars from "../hooks/useFetchGithubStars";
import HelpMenu from "./HelpMenu";
import UpgradeCtaButton from "./UpgradeCtaButton";
import WorkspaceBanner from "./WorkspaceBanner";
import "./WorkspaceHeader.scss";
import styles from "./notificationStyle";

const CLASS_NAME = "workspace-header";
const AMP_GITHUB_URL = "https://github.com/amplication/amplication";

export { CLASS_NAME as WORK_SPACE_HEADER_CLASS_NAME };
export const PROJECT_CONFIGURATION_RESOURCE_NAME = "Project Configuration";

const WorkspaceHeader: React.FC = () => {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const apolloClient = useApolloClient();
  const { stigg } = useStiggContext();
  const { trackEvent } = useTracking();
  const stars = useFetchGithubStars();

  const breadcrumbsContext = useContext(BreadcrumbsContext);

  const [novuCenterState, setNovuCenterState] = useState(false);
  const canShowNotification = stigg.getBooleanEntitlement({
    featureId: BillingFeature.Notification,
  }).hasAccess;

  const [showProfileFormDialog, setShowProfileFormDialog] =
    useState<boolean>(false);

  const handleSignOut = useCallback(() => {
    unsetToken();
    apolloClient.clearStore();

    window.location.replace(REACT_APP_AUTH_LOGOUT_URI);
  }, [apolloClient]);

  const onNotificationClick = useCallback(
    (message: IMessage) => {
      trackEvent({
        eventName: AnalyticsEventNames.ClickNotificationMessage,
        messageType: message.templateIdentifier,
      });

      if (message?.cta?.data?.url) {
        // window.location.href = message.cta.data.url;
      }
    },
    [trackEvent]
  );

  const onBuildNotificationClick = useCallback(
    (templateIdentifier: string, type: ButtonTypeEnum, message: IMessage) => {
      window.location.href = message.cta.data.url;
    },
    []
  );

  const handleShowProfileForm = useCallback(() => {
    setShowProfileFormDialog(!showProfileFormDialog);
  }, [showProfileFormDialog, setShowProfileFormDialog]);

  const handleBellClick = useCallback(() => {
    if (!novuCenterState) {
      trackEvent({
        eventName: AnalyticsEventNames.OpenNotificationCenter,
      });
    }
    setNovuCenterState(!novuCenterState);
  }, [novuCenterState, trackEvent]);

  const Footer = () => <div></div>;

  const EmptyState = () => (
    <div className="notification_container">
      <img src={NoNotifications} alt="" />
      <div className="notification_text">
        <span>All caught up! </span>
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        className="new-entity-dialog"
        isOpen={showProfileFormDialog}
        onDismiss={handleShowProfileForm}
        title="User Profile"
      >
        <ProfileForm />
      </Dialog>
      <WorkspaceBanner
        to={AMP_GITHUB_URL}
        clickEventName={AnalyticsEventNames.StarUsBannerCTAClick}
        clickEventProps={{}}
        closeEventName={AnalyticsEventNames.StarUsBannerClose}
        closeEventProps={{}}
      >
        <Icon icon="github" />
        Star us on GitHub{" "}
        <span className={`${CLASS_NAME}__stars`}>
          {stars} <Icon icon="star" />
        </span>
      </WorkspaceBanner>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__left`}>
          <div className={`${CLASS_NAME}__logo`}>
            <Link to={`/${currentWorkspace?.id}`}>
              <Icon icon="logo" size="medium" />
            </Link>
          </div>

          <ConsoleNavigationButton />

          <Breadcrumbs>
            {breadcrumbsContext.breadcrumbsItems.map((item, index) => (
              <Breadcrumbs.Item key={item.url} to={item.url}>
                {item.name}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        </div>
        <div className={`${CLASS_NAME}__center`}></div>
        <div className={`${CLASS_NAME}__right`}>
          <div className={`${CLASS_NAME}__links`}>
            <hr className={`${CLASS_NAME}__vertical_border`} />
            <AskJovuButton />
            <UpgradeCtaButton />
          </div>
          <hr className={`${CLASS_NAME}__vertical_border`} />

          <HelpMenu />
          {canShowNotification && (
            <>
              <hr className={`${CLASS_NAME}__vertical_border`} />
              <div className={`${CLASS_NAME}__notification_bell`}>
                <NovuProvider
                  subscriberId={currentWorkspace.externalId}
                  applicationIdentifier={REACT_APP_NOVU_IDENTIFIER}
                  styles={styles}
                >
                  <PopoverNotificationCenter
                    colorScheme={"dark"}
                    position="left-start"
                    offset={0}
                    onNotificationClick={onNotificationClick}
                    onActionClick={onBuildNotificationClick}
                    footer={() => <Footer />}
                    emptyState={<EmptyState />}
                  >
                    {({ unseenCount }) => (
                      <div onClick={handleBellClick}>
                        <NotificationBell unseenCount={unseenCount} />
                      </div>
                    )}
                  </PopoverNotificationCenter>
                </NovuProvider>
              </div>
            </>
          )}
          <hr className={`${CLASS_NAME}__vertical_border`} />
          <div
            className={`${CLASS_NAME}__user_badge_wrapper`}
            onClick={handleShowProfileForm}
          >
            <UserBadge />
          </div>

          <hr className={`${CLASS_NAME}__vertical_border`} />

          <Tooltip
            className="amp-menu-item__tooltip"
            aria-label={`Logout`}
            direction="sw"
            noDelay
          >
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="log_out"
              onClick={handleSignOut}
            />
          </Tooltip>
        </div>
      </div>

      {currentProject?.useDemoRepo && (
        <div className={`${CLASS_NAME}__highlight`}>
          Notice: You're currently using a preview repository for your generated
          code. For a full personalized experience, please&nbsp;
          <Link title={"Go to project settings"} to={`${baseUrl}/git-sync`}>
            connect to your own repository
          </Link>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
