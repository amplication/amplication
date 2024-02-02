import {
  Breadcrumbs,
  ButtonProgress,
  Dialog,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Tooltip,
} from "@amplication/ui/design-system";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  ButtonTypeEnum,
  IMessage,
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { useStiggContext } from "@stigg/react-sdk";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMacOs } from "react-device-detect";
import { Link, useHistory } from "react-router-dom";
import CommandPalette from "../../CommandPalette/CommandPalette";
import { Button, EnumButtonStyle } from "../../Components/Button";
import UserBadge from "../../Components/UserBadge";
import BreadcrumbsContext from "../../Layout/BreadcrumbsContext";
import ProfileForm from "../../Profile/ProfileForm";
import { unsetToken } from "../../authentication/authentication";
import { AppContext } from "../../context/appContext";
import {
  REACT_APP_AUTH_LOGOUT_URI,
  REACT_APP_NOVU_IDENTIFIER,
} from "../../env";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import {
  AMPLICATION_DISCORD_URL,
  AMPLICATION_DOC_URL,
} from "../../util/constants";
import { version } from "../../util/version";
import GitHubBanner from "./GitHubBanner";
import styles from "./notificationStyle";
import NoNotifications from "../../assets/images/no-notification.svg";
import "./WorkspaceHeader.scss";
import { BillingFeature } from "@amplication/util-billing-types";
import { useUpgradeButtonData } from "../hooks/useUpgradeButtonData";
import { GET_CONTACT_US_LINK } from "../queries/workspaceQueries";
import { FeatureIndicator } from "../../Components/FeatureIndicator";
import { CompleteSignupDialog } from "../../Components/CompleteSignupDialog";
import { COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL } from "../../User/UserQueries";

const CLASS_NAME = "workspace-header";
export { CLASS_NAME as WORK_SPACE_HEADER_CLASS_NAME };
export const PROJECT_CONFIGURATION_RESOURCE_NAME = "Project Configuration";

enum ItemDataCommand {
  COMMAND_CONTACT_US = "command_contact_us",
}

type HelpMenuItem = {
  name: string;
  url: string | null;
  itemData: ItemDataCommand | null;
};

const HELP_MENU_LIST: HelpMenuItem[] = [
  { name: "Docs", url: AMPLICATION_DOC_URL, itemData: null },
  {
    name: "Technical Support",
    url: AMPLICATION_DISCORD_URL,
    itemData: null,
  },
  {
    name: "Contact Us",
    url: null,
    itemData: ItemDataCommand.COMMAND_CONTACT_US,
  },
];

const WorkspaceHeader: React.FC = () => {
  const { currentWorkspace, currentProject, openHubSpotChat } =
    useContext(AppContext);
  const upgradeButtonData = useUpgradeButtonData(currentWorkspace);

  const [completeSignup] = useMutation(COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL);

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

  const apolloClient = useApolloClient();
  const history = useHistory();
  const { stigg } = useStiggContext();
  const { trackEvent } = useTracking();
  const novuBellRef = useRef(null);

  const daysLeftText = useMemo(() => {
    return `${upgradeButtonData.trialDaysLeft} day${
      upgradeButtonData.trialDaysLeft !== 1 ? "s" : ""
    } left for the free trial`;
  }, [upgradeButtonData.trialDaysLeft]);

  const breadcrumbsContext = useContext(BreadcrumbsContext);

  const [novuCenterState, setNovuCenterState] = useState(false);
  const canShowNotification = stigg.getBooleanEntitlement({
    featureId: BillingFeature.Notification,
  }).hasAccess;

  const [showProfileFormDialog, setShowProfileFormDialog] =
    useState<boolean>(false);

  const [showCompleteSignupDialog, setShowCompleteSignupDialog] =
    useState<boolean>(false);

  const handleSignOut = useCallback(() => {
    unsetToken();
    apolloClient.clearStore();

    window.location.replace(REACT_APP_AUTH_LOGOUT_URI);
  }, [history, apolloClient]);

  const onNotificationClick = useCallback((message: IMessage) => {
    trackEvent({
      eventName: AnalyticsEventNames.ClickNotificationMessage,
      messageType: message.templateIdentifier,
    });

    if (message?.cta?.data?.url) {
      // window.location.href = message.cta.data.url;
    }
  }, []);

  const onBuildNotificationClick = useCallback(
    (templateIdentifier: string, type: ButtonTypeEnum, message: IMessage) => {
      if (templateIdentifier === "build-completed") {
        window.location.href = message.cta.data.url;
      }
    },
    []
  );

  const handleUpgradeClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: "workspace-header",
      workspace: currentWorkspace.id,
    });
  }, [currentWorkspace, window.location.pathname]);

  const handleContactUsClick = useCallback(() => {
    window.open(data?.contactUsLink, "_blank");
    trackEvent({
      eventName: AnalyticsEventNames.HelpMenuItemClick,
      action: "Contact Us",
      eventOriginLocation: "workspace-header-help-menu",
    });
  }, [openHubSpotChat]);

  const handleGenerateCodeClick = useCallback(() => {
    completeSignup();
    setShowCompleteSignupDialog(!showCompleteSignupDialog);
    trackEvent({
      eventName: AnalyticsEventNames.HelpMenuItemClick,
      action: "Generate code",
      eventOriginLocation: "workspace-header-help-menu",
    });
  }, [completeSignup, showCompleteSignupDialog, trackEvent]);

  const handleItemDataClicked = useCallback(
    (itemData: ItemDataCommand) => {
      if (itemData === ItemDataCommand.COMMAND_CONTACT_US) {
        handleContactUsClick();
      }
      return;
    },
    [handleContactUsClick]
  );
  const handleShowProfileForm = useCallback(() => {
    setShowProfileFormDialog(!showProfileFormDialog);
  }, [showProfileFormDialog, setShowProfileFormDialog]);

  const handleShowCompleteSignupDialog = useCallback(() => {
    setShowCompleteSignupDialog(!showCompleteSignupDialog);
  }, [showCompleteSignupDialog]);

  const handleBellClick = useCallback(() => {
    if (!novuCenterState) {
      trackEvent({
        eventName: AnalyticsEventNames.OpenNotificationCenter,
      });
    }
    setNovuCenterState(!novuCenterState);
  }, [novuBellRef, novuCenterState]);

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
      <GitHubBanner />
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__left`}>
          <div className={`${CLASS_NAME}__logo`}>
            <Link to={`/${currentWorkspace?.id}`}>
              <Icon icon="logo" size="medium" />
            </Link>
          </div>
          <span>
            <a
              href="https://github.com/amplication/amplication/releases"
              target="_blank"
              rel="noopener noreferrer"
              className={`${CLASS_NAME}__version`}
            >
              v{version}
            </a>
          </span>
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
            {upgradeButtonData.isCompleted &&
              upgradeButtonData.showUpgradeTrialButton && (
                <ButtonProgress
                  className={`${CLASS_NAME}__upgrade__btn`}
                  onClick={handleUpgradeClick}
                  progress={upgradeButtonData.trialLeftProgress}
                  leftValue={daysLeftText}
                  yellowColorThreshold={50}
                  redColorThreshold={0}
                >
                  Upgrade
                </ButtonProgress>
              )}
            {upgradeButtonData.isCompleted &&
              upgradeButtonData.showUpgradeDefaultButton && (
                <Button
                  className={`${CLASS_NAME}__upgrade__btn`}
                  buttonStyle={EnumButtonStyle.Outline}
                  onClick={handleUpgradeClick}
                >
                  Upgrade
                </Button>
              )}
            {upgradeButtonData.isCompleted &&
              upgradeButtonData.isPreviewPlan &&
              !upgradeButtonData.showUpgradeDefaultButton && (
                <>
                  <Dialog
                    className="new-entity-dialog"
                    isOpen={showCompleteSignupDialog}
                    onDismiss={handleShowCompleteSignupDialog}
                    title="Generate your Code"
                  >
                    <CompleteSignupDialog
                      handleDialogClose={handleShowCompleteSignupDialog}
                    />
                  </Dialog>
                  <FeatureIndicator
                    featureName={BillingFeature.CodeGenerationBuilds}
                    text="Generate production-ready code for this architecture with just a few simple clicks"
                    linkText=""
                    element={
                      <Button
                        className={`${CLASS_NAME}__upgrade__btn`}
                        buttonStyle={EnumButtonStyle.Primary}
                        onClick={handleGenerateCodeClick}
                      >
                        Generate the code
                      </Button>
                    }
                  />
                  <Button
                    className={`${CLASS_NAME}__upgrade__btn`}
                    buttonStyle={EnumButtonStyle.Outline}
                    onClick={handleContactUsClick}
                  >
                    Contact us
                  </Button>
                </>
              )}
          </div>
          <hr className={`${CLASS_NAME}__vertical_border`} />

          <CommandPalette
            trigger={
              <Tooltip
                className="amp-menu-item__tooltip"
                aria-label={`Search (${isMacOs ? "⌘" : "Ctrl"}+Shift+K)`}
                direction="sw"
                noDelay
              >
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  icon="search"
                  iconSize="small"
                />
              </Tooltip>
            }
          />
          <hr className={`${CLASS_NAME}__vertical_border`} />
          <div className={`${CLASS_NAME}__help_popover`}>
            <SelectMenu
              title="Help"
              buttonStyle={EnumButtonStyle.Text}
              icon="chevron_down"
              openIcon="chevron_up"
              className={`${CLASS_NAME}__help_popover__menu`}
            >
              <SelectMenuModal align="right">
                <SelectMenuList>
                  {HELP_MENU_LIST.map((route: HelpMenuItem, index) => (
                    <SelectMenuItem
                      closeAfterSelectionChange
                      onSelectionChange={() => {
                        !route.url && handleItemDataClicked(route.itemData);
                      }}
                      key={index}
                      {...(route.url
                        ? {
                            rel: "noopener noreferrer",
                            href: route.url,
                            target: "_blank",
                          }
                        : {})}
                    >
                      <div className={`${CLASS_NAME}__help_popover__name`}>
                        {route.name}
                      </div>
                    </SelectMenuItem>
                  ))}
                </SelectMenuList>
              </SelectMenuModal>
            </SelectMenu>
          </div>
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

          <CommandPalette
            trigger={
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
            }
          />
        </div>
      </div>

      {currentProject?.useDemoRepo && (
        <div className={`${CLASS_NAME}__highlight`}>
          Notice: You're currently using a preview repository for your generated
          code. For a full personalized experience, please&nbsp;
          <Link
            title={"Go to project settings"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/git-sync`}
          >
            connect to your own repository
          </Link>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
