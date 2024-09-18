import {
  Breadcrumbs,
  Dialog,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
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
import { Link, useHistory } from "react-router-dom";
import AskJovuButton from "../../Assistant/AskJovuButton";
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
import {
  AMPLICATION_DISCORD_URL,
  AMPLICATION_DOC_URL,
} from "../../util/constants";
import { version } from "../../util/version";
import { useContactUs } from "../hooks/useContactUs";
import useFetchGithubStars from "../hooks/useFetchGithubStars";
import UpgradeCtaButton from "./UpgradeCtaButton";
import WorkspaceBanner from "./WorkspaceBanner";
import "./WorkspaceHeader.scss";
import styles from "./notificationStyle";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";

const CLASS_NAME = "workspace-header";
const AMP_GITHUB_URL = "https://github.com/amplication/amplication";

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
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const { handleContactUsClick } = useContactUs({
    actionName: "Contact Us",
    eventOriginLocation: "workspace-header-help-menu",
  });

  const apolloClient = useApolloClient();
  const { stigg } = useStiggContext();
  const { trackEvent } = useTracking();
  const stars = useFetchGithubStars();
  const history = useHistory();

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
            <AskJovuButton />
            <UpgradeCtaButton />
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
                  <SelectMenuItem
                    closeAfterSelectionChange
                    onSelectionChange={() => {
                      history.push(`/${currentWorkspace?.id}/purchase`);
                    }}
                  >
                    <div className={`${CLASS_NAME}__help_popover__name`}>
                      Pricing Plans
                    </div>
                  </SelectMenuItem>
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
          <Link title={"Go to project settings"} to={`${baseUrl}/git-sync`}>
            connect to your own repository
          </Link>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
