import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Tooltip,
} from "@amplication/design-system";
import { useApolloClient } from "@apollo/client";
import React, { useCallback, useContext } from "react";
import * as models from "../models";
import UserBadge from "../Components/UserBadge";
import { AppContext } from "../context/appContext";
import { isMacOs } from "react-device-detect";
import "./WorkspaceHeader.scss";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import CommandPalette from "../CommandPalette/CommandPalette";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Link, useHistory } from "react-router-dom";
import { unsetToken } from "../authentication/authentication";
import MenuItem from "../Layout/MenuItem";
import { matchPath } from "react-router";

const CLASS_NAME = "workspace-header";

const WorkspaceHeader: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    setResource,
    resources,
  } = useContext(AppContext);
  const apolloClient = useApolloClient();
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/login");
  }, [history, apolloClient]);

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
              <div className={`${CLASS_NAME}__breadcrumbs__project`}>
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
                    <p
                      className={`${CLASS_NAME}__breadcrumbs__resource__title ${CLASS_NAME}__breadcrumbs__resource__title${
                        currentResource ? "__selected" : "__not_selected"
                      }`}
                    >
                      {currentResource ? currentResource.name : "Resource List"}
                    </p>
                  }
                  buttonStyle={EnumButtonStyle.Text}
                  icon="chevron_down"
                  openIcon="chevron_up"
                  className={`${CLASS_NAME}__breadcrumbs__menu`}
                >
                  <SelectMenuModal css={undefined}>
                    <SelectMenuList>
                      {resources.map((resource: models.Resource) => (
                        <SelectMenuItem
                          css={null}
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
                    </SelectMenuList>
                    <hr className={`${CLASS_NAME}__divider`}/>
                    <SelectMenuItem
                      css={null}
                      closeAfterSelectionChange
                      selected={
                        match?.path ===
                        `/${currentWorkspace?.id}/${currentProject.id}/commits`
                      }
                      key="1"
                      onSelectionChange={() => {
                        history.push(
                          `/${currentWorkspace?.id}/${currentProject.id}/commits`
                        );
                      }}
                    >
                      <span>Commits</span>
                    </SelectMenuItem>
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
                iconSize="medium"
              />
            </Tooltip>
          }
        />
        <hr className={`${CLASS_NAME}__vertical_border`} />

        <a href="/user/profile">
          <UserBadge />
        </a>
        <hr className={`${CLASS_NAME}__vertical_border`} />

        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="log_out_outline"
          onClick={handleSignOut}
        />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
