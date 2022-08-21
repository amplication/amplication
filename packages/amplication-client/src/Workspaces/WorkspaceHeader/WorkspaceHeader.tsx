import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Tooltip,
} from "@amplication/design-system";
import { useApolloClient } from "@apollo/client";
import React, { useCallback, useContext } from "react";
import { isMacOs } from "react-device-detect";
import { matchPath } from "react-router";
import { Link, useHistory, useLocation } from "react-router-dom";
import { unsetToken } from "../../authentication/authentication";
import CommandPalette from "../../CommandPalette/CommandPalette";
import { Button, EnumButtonStyle } from "../../Components/Button";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import UserBadge from "../../Components/UserBadge";
import { AppContext } from "../../context/appContext";
import MenuItem from "../../Layout/MenuItem";
import * as models from "../../models";
import HeaderMenuStaticOptions from "./HeaderMenuStaticOptions";
import "./WorkspaceHeader.scss";
import WorkspaceHeaderTitle from "./WorkspaceHeaderTitle";

const CLASS_NAME = "workspace-header";
export { CLASS_NAME as WORK_SPACE_HEADER_CLASS_NAME };
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

  const handleSignOut = useCallback(() => {
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/login");
  }, [history, apolloClient]);

  const location = useLocation();
  const isProjectRoute =
    location.pathname === `/${currentWorkspace?.id}/${currentProject?.id}`;
  const isResourceRoute =
    location.pathname ===
    `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}`;
  const match = matchPath(
    `/${currentWorkspace?.id}/${currentProject?.id}/commits`,
    {
      path: "/:workspace/:project/commits",
      exact: true,
      strict: false,
    }
  );

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
                  css={undefined}
                  title={
                    currentResource && (
                      <WorkspaceHeaderTitle resource={currentResource} />
                    )
                  }
                  buttonStyle={EnumButtonStyle.Text}
                  buttonClassName={isResourceRoute ? "highlight" : ""}
                  icon="chevron_down"
                  openIcon="chevron_up"
                  className={`${CLASS_NAME}__breadcrumbs__menu`}
                >
                  <SelectMenuModal>
                    <SelectMenuList>
                      {resources.map((resource: models.Resource) => (
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
                              size="medium"
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
                    </SelectMenuList>
                    <hr className={`${CLASS_NAME}__divider`} />

                    <HeaderMenuStaticOptions
                      currentProjectConfigurationId={
                        currentProjectConfiguration?.id
                      }
                      currentProjectId={currentProject.id}
                      currentWorkspaceId={currentWorkspace?.id}
                      history={history}
                      path={match?.path}
                    />
                  </SelectMenuModal>
                </SelectMenu>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={`${CLASS_NAME}__right`}>
        <div className={`${CLASS_NAME}__links`}>
          <a
            className={`${CLASS_NAME}__links__link`}
            rel="noopener noreferrer"
            href="https://docs.amplication.com/docs"
            target="_blank"
          >
            Blog
          </a>
          <a
            className={`${CLASS_NAME}__links__link`}
            rel="noopener noreferrer"
            href="https://docs.amplication.com/docs"
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
