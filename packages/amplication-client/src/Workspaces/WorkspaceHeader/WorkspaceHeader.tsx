import {
  HorizontalRule,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Tooltip,
  Dialog,
} from "@amplication/ui/design-system";
import { useApolloClient } from "@apollo/client";
import React, { useCallback, useContext, useState } from "react";
import { isMacOs } from "react-device-detect";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import GitHubBanner from "./GitHubBanner";
import { unsetToken } from "../../authentication/authentication";
import CommandPalette from "../../CommandPalette/CommandPalette";
import { Button, EnumButtonStyle } from "../../Components/Button";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import UserBadge from "../../Components/UserBadge";
import { AppContext } from "../../context/appContext";
import MenuItem from "../../Layout/MenuItem";
import * as models from "../../models";
import HeaderMenuStaticOptions from "./HeaderMenuStaticOptions";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import "./WorkspaceHeader.scss";
import { useTracking } from "../../util/analytics";
import ProfileForm from "../../Profile/ProfileForm";
import { version } from "../../util/version";
import {
  AMPLICATION_DISCORD_URL,
  AMPLICATION_DOC_URL,
} from "../../util/constants";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import { NX_REACT_APP_AUTH_LOGOUT_URI } from "../../env";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../../util/BillingFeature";

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

// eslint-disable-next-line @typescript-eslint/ban-types
const WorkspaceHeader: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    setResource,
    resources,
    currentProjectConfiguration,
    openHubSpotChat,
  } = useContext(AppContext);
  const apolloClient = useApolloClient();
  const history = useHistory();
  const { stigg } = useStiggContext();
  const { trackEvent } = useTracking();
  const isProjectRoute = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})"
  );
  const isResourceRoute = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})"
  );
  const isCommitsRoute = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/commits/:commit([A-Za-z0-9-]{20,})?"
  );
  const isCodeViewRoute = useRouteMatch(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/code-view"
  );
  const [versionAlert, setVersionAlert] = useState(false);
  const getSelectedEntities = useCallback(() => {
    if (
      (isResourceRoute && currentResource) ||
      (isResourceRoute && currentProjectConfiguration)
    )
      return currentResource?.resourceType ===
        models.EnumResourceType.ProjectConfiguration
        ? PROJECT_CONFIGURATION_RESOURCE_NAME
        : currentResource?.name;

    if (isCommitsRoute) return "Commits";

    if (isCodeViewRoute) return "View Code";
  }, [
    currentResource,
    isCodeViewRoute,
    isCommitsRoute,
    isResourceRoute,
    currentProjectConfiguration,
  ]);

  const canShowNotification = stigg.getBooleanEntitlement({
    featureId: BillingFeature.Notification,
  }).hasAccess;

  const [showProfileFormDialog, setShowProfileFormDialog] =
    useState<boolean>(false);

  const handleSignOut = useCallback(() => {
    unsetToken();
    apolloClient.clearStore();

    window.location.replace(NX_REACT_APP_AUTH_LOGOUT_URI);
  }, [history, apolloClient]);

  const onNotificationClick = useCallback((message: IMessage) => {
    // your logic to handle the notification click
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  }, []);

  const handleUpgradeClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeOnTopBarClick,
      workspace: currentWorkspace.id,
    });
  }, [currentWorkspace, window.location.pathname]);

  const handleContactUsClick = useCallback(() => {
    // This query param is used to open HubSpot chat with the downgrade flow
    history.push("?contact-us=true");
    openHubSpotChat();
    trackEvent({
      eventName: AnalyticsEventNames.HelpMenuItemClick,
      Action: "Contact Us",
      workspaceId: currentWorkspace.id,
    });
  }, [openHubSpotChat]);

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
            <MenuItem
              title="Home"
              icon="logo"
              to={`/${currentWorkspace?.id}/${currentProject?.id}`}
              disableHover
            />
          </div>
          <Tooltip
            aria-label="Version number copied successfully"
            direction="e"
            noDelay
            show={versionAlert}
          >
            <Button
              className={`${CLASS_NAME}__version`}
              buttonStyle={EnumButtonStyle.Clear}
              onClick={async () => {
                setVersionAlert(true);
                await navigator.clipboard.writeText(version);
              }}
              onMouseLeave={() => {
                setVersionAlert(false);
              }}
            >
              <span>v{version}</span>
            </Button>
          </Tooltip>
        </div>
        <div className={`${CLASS_NAME}__center`}>
          <div className={`${CLASS_NAME}__breadcrumbs`}>
            {currentProject && (
              <>
                <div
                  className={`${CLASS_NAME}__breadcrumbs__project ${
                    isProjectRoute ? "highlight" : ""
                  }`}
                >
                  <Link to={`/${currentWorkspace?.id}/${currentProject?.id}`}>
                    {currentProject?.name}
                  </Link>
                </div>
                <div>
                  <hr className={`${CLASS_NAME}__vertical_border`} />
                </div>
                <div className={`${CLASS_NAME}__breadcrumbs__resource`}>
                  <SelectMenu
                    title={
                      <p
                        className={`${CLASS_NAME}__breadcrumbs__resource__title`}
                      >
                        {getSelectedEntities() || "Resource List"}
                      </p>
                    }
                    buttonStyle={EnumButtonStyle.Text}
                    buttonClassName={isResourceRoute ? "highlight" : ""}
                    icon="chevron_down"
                    openIcon="chevron_up"
                    className={`${CLASS_NAME}__breadcrumbs__menu`}
                  >
                    <SelectMenuModal align="right">
                      <SelectMenuList>
                        {resources.length > 0 && (
                          <>
                            {resources.length &&
                              resources.map((resource: models.Resource) => (
                                <SelectMenuItem
                                  closeAfterSelectionChange
                                  selected={currentResource?.id === resource.id}
                                  key={resource.id}
                                  onSelectionChange={() => {
                                    setResource(resource);
                                  }}
                                >
                                  <div
                                    className={`${CLASS_NAME}__breadcrumbs__resource__item`}
                                  >
                                    <ResourceCircleBadge
                                      type={
                                        resource.resourceType as models.EnumResourceType
                                      }
                                      size="xsmall"
                                    />
                                    <div
                                      className={`${CLASS_NAME}__breadcrumbs__resource__text`}
                                    >
                                      <div
                                        className={`${CLASS_NAME}__breadcrumbs__resource__text__name`}
                                      >
                                        {resource.name}
                                      </div>
                                      <div
                                        className={`${CLASS_NAME}__breadcrumbs__resource__text__desc`}
                                      >
                                        {resource.description}
                                      </div>
                                    </div>
                                  </div>
                                </SelectMenuItem>
                              ))}

                            <HorizontalRule />
                          </>
                        )}

                        <HeaderMenuStaticOptions
                          currentProjectConfigurationId={
                            currentProjectConfiguration?.id
                          }
                          currentProjectId={currentProject.id}
                          currentWorkspaceId={currentWorkspace?.id}
                          history={history}
                          path={isCommitsRoute?.url}
                        />
                      </SelectMenuList>
                    </SelectMenuModal>
                  </SelectMenu>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={`${CLASS_NAME}__right`}>
          <div className={`${CLASS_NAME}__links`}>
            <Button
              className={`${CLASS_NAME}__upgrade__btn`}
              buttonStyle={EnumButtonStyle.Outline}
              onClick={handleUpgradeClick}
            >
              Upgrade
            </Button>
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
                  applicationIdentifier={"gY2CIIdnBCc1"}
                >
                  <PopoverNotificationCenter
                    colorScheme={"dark"}
                    onNotificationClick={onNotificationClick}
                  >
                    {({ unseenCount }) => (
                      <NotificationBell unseenCount={unseenCount} />
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

          <Button
            buttonStyle={EnumButtonStyle.Text}
            icon="log_out"
            onClick={handleSignOut}
          />
        </div>
      </div>

      {currentProject?.useDemoRepo && (
        <div className={`${CLASS_NAME}__highlight`}>
          Notice: You're currently using a preview repository for your generated
          code. For a full personalized experience, please&nbsp;
          <Link
            title={"Go to project settings"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentProjectConfiguration?.id}/git-sync`}
          >
            connect to your own repository
          </Link>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
