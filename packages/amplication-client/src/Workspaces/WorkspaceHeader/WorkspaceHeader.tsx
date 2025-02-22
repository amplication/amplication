import {
  Breadcrumbs,
  Dialog,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  OptionItem,
  Text,
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
import { Link, useHistory } from "react-router-dom";
import AskJovuButton from "../../Assistant/AskJovuButton";
import ConsoleNavigationButton from "../../Assistant/ConsoleNavigationButton";
import { Button, EnumButtonStyle } from "../../Components/Button";
import ProjectSelector from "../../Components/ProjectSelector";
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
import ResourceSelector from "../../Components/ResourceSelector2";

const CLASS_NAME = "workspace-header";
const AMP_GITHUB_URL = "https://github.com/amplication/amplication";

const ALL_VALUE = "-1";

const ALL_PROJECTS_ITEM: OptionItem = {
  label: "All Projects",
  value: ALL_VALUE,
};
const ALL_RESOURCES_ITEM: OptionItem = {
  label: "All Resources",
  value: ALL_VALUE,
};

export { CLASS_NAME as WORK_SPACE_HEADER_CLASS_NAME };
export const PROJECT_CONFIGURATION_RESOURCE_NAME = "Project Configuration";

const WorkspaceHeader: React.FC = () => {
  const { currentWorkspace, currentProject, currentResource, resources } =
    useContext(AppContext);
  const { baseUrl, isPlatformConsole } = useProjectBaseUrl();

  const history = useHistory();

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

  const handleProjectSelected = useCallback(
    (value: string) => {
      const platformPath = isPlatformConsole ? "/platform" : "";

      const url =
        value === ALL_VALUE
          ? `/${currentWorkspace?.id}`
          : `/${currentWorkspace?.id}${platformPath}/${value}`;

      history.push(url);
    },
    [currentWorkspace?.id, history, isPlatformConsole]
  );

  const handleResourceSelected = useCallback(
    (value: string) => {
      const platformPath = isPlatformConsole ? "/platform" : "";

      const url =
        value === ALL_VALUE
          ? `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}`
          : `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}/${value}`;

      history.push(url);
    },
    [currentProject?.id, currentWorkspace?.id, history, isPlatformConsole]
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

          <FlexItem
            direction={EnumFlexDirection.Row}
            gap={EnumGapSize.Default}
            itemsAlign={EnumItemsAlign.Center}
          >
            <span />

            <Link to={`/${currentWorkspace?.id}`}>
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Tag}
              >
                {currentWorkspace?.name}
              </Text>
            </Link>

            <span className={`${CLASS_NAME}__separator`}>/</span>
            <ProjectSelector
              onChange={handleProjectSelected}
              selectedValue={currentProject?.id || ALL_VALUE}
              allProjectsItem={ALL_PROJECTS_ITEM}
            />
            {currentProject && (
              <>
                <span className={`${CLASS_NAME}__separator`}>/</span>
                <ConsoleNavigationButton />
                <span className={`${CLASS_NAME}__separator`}>/</span>
                {/* {currentResource && ( */}
                <>
                  <ResourceSelector
                    onChange={handleResourceSelected}
                    selectedValue={currentResource?.id || ALL_VALUE}
                    allResourcesItem={ALL_RESOURCES_ITEM}
                    isPlatformConsole={isPlatformConsole}
                  />
                </>
                {/* )} */}
                {breadcrumbsContext.breadcrumbsItems.length > 0 && (
                  <>
                    <span className={`${CLASS_NAME}__separator`}>/</span>
                    <Breadcrumbs>
                      {breadcrumbsContext.breadcrumbsItems.map(
                        (item, index) => (
                          <Breadcrumbs.Item key={item.url} to={item.url}>
                            {item.name}
                          </Breadcrumbs.Item>
                        )
                      )}
                    </Breadcrumbs>
                  </>
                )}
              </>
            )}
          </FlexItem>
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
