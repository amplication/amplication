import {
  EnumButtonStyle,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React, { useContext } from "react";
import * as models from "../models";
import UserBadge from "../Components/UserBadge";
import { AppContext } from "../context/appContext";
import "./WorkspaceHeader.scss";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";

const CLASS_NAME = "workspace-header";

const WorkspaceHeader: React.FC<{}> = () => {
  const { currentProject, currentResource, setResource, resources } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__logo`}>
        <Icon icon="logo white" size="medium" />
      </div>
      <div className={`${CLASS_NAME}__breadcrumbs`}>
        <div className={`${CLASS_NAME}__breadcrumbs__project`}>
          {currentProject?.name}
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
            <SelectMenuModal
              css={undefined}
              sx={{
                width: "220px",
                background: "#22273c",
                border: "1px solid #515873",
                boxShadow: "0px 18px 28px -8px rgba(9, 11, 20, 0.6)",
                borderRadius: "8px",
                right: "45%",
                ":first-child": {
                  width: "220px",
                },
              }}
            >
              <SelectMenuList
                sx={{
                  width: "220px",
                  display: "flex",
                  padding: "5px 0px",
                  flexDirection: "column",
                  border: "none",
                }}
              >
                {resources.map((resource: models.Resource) => (
                  <SelectMenuItem
                    css={null}
                    sx={{
                      padding: "0px",
                      marginBottom: "4px",
                    }}
                    closeAfterSelectionChange
                    selected={currentResource?.id === resource.id}
                    key={resource.id}
                    onSelectionChange={() => {
                      setResource(resource)
                    }}
                  >
                    <div
                      className={`${CLASS_NAME}__breadcrumbs__resource__item`}
                    >
                      <ResourceCircleBadge
                        type={
                          resource.resourceType.toLowerCase() as models.EnumResourceType
                        }
                        size="xsmall"
                      />
                      <div
                        className={`${CLASS_NAME}__breadcrumbs__resource__text`}
                      >
                        <div className={`${CLASS_NAME}__breadcrumbs__resource__text__name`}>{resource.name}</div>
                        <div className={`${CLASS_NAME}__breadcrumbs__resource__text__desc`}>{resource.description}</div>
                      </div>
                    </div>
                  </SelectMenuItem>
                ))}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu>
        </div>
      </div>
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
      <div className={`${CLASS_NAME}__search`}>
        <Icon icon="search" size="medium" />
      </div>
      <hr className={`${CLASS_NAME}__vertical_border`} />
      <div className={`${CLASS_NAME}__user`}>
        <UserBadge />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
