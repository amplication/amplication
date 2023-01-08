import {
  HorizontalRule,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Tooltip,
} from "@amplication/design-system";
import { useApolloClient } from "@apollo/client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { isMacOs } from "react-device-detect";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
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

const CLASS_NAME = "workspace-header";
export { CLASS_NAME as WORK_SPACE_HEADER_CLASS_NAME };
export const PROJECT_CONFIGURATION_RESOURCE_NAME = "Project Configuration";

// eslint-disable-next-line @typescript-eslint/ban-types
const WorkspaceHeader: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    setResource,
    resources,
    currentProjectConfiguration,
  } = useContext(AppContext);
  const apolloClient = useApolloClient();
  const history = useHistory();
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

  const [version, setVersion] = useState("");
  useEffect(() => {
    import("../../util/version").then(({ version }) => {
      setVersion(version);
    });
  }, []);

  const handleSignOut = useCallback(() => {
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/login");
  }, [history, apolloClient]);

  const handleUpgradeClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeOnTopBarClick,
      workspace: currentWorkspace.id,
    });
  }, [trackEvent]);

  return (
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
            <Link
              className={`${CLASS_NAME}__upgrade__link`}
              to={{
                pathname: `/${currentWorkspace?.id}/purchase`,
                state: { from: { pathname: window.location.pathname } },
              }}
            >
              Upgrade
            </Link>
          </Button>
          <a
            className={`${CLASS_NAME}__links__link`}
            rel="noopener noreferrer"
            href="https://amplication.com/blog"
            target="_blank"
          >
            Blog
          </a>
          <a
            className={`${CLASS_NAME}__links__link`}
            rel="noopener noreferrer"
            href="https://docs.amplication.com"
            target="_blank"
          >
            Docs
          </a>
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

        <a className={`${CLASS_NAME}__user_badge_wrapper`} href="/user/profile">
          <UserBadge />
        </a>

        <hr className={`${CLASS_NAME}__vertical_border`} />

        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="log_out"
          onClick={handleSignOut}
        />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
