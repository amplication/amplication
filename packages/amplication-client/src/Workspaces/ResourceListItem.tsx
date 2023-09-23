import { useCallback, useContext, useState } from "react";

import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

import {
  ConfirmationDialog,
  Icon,
  ListItem,
  UserAndTime,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import EllipsisText from "../Components/EllipsisText";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";
import { AppContext } from "../context/appContext";
import "./ResourceListItem.scss";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

const CLASS_NAME = "resource-list-item";
const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function ResourceListItem({ resource, onDelete }: Props) {
  const { currentWorkspace, currentProject, setResource } =
    useContext(AppContext);
  const { id, name, description, gitRepository, resourceType } = resource;
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setConfirmDelete(true);
      return false;
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    onDelete && onDelete(resource);
  }, [onDelete, resource]);

  const handleClick = useCallback(() => {
    setResource(resource);
  }, [resource, setResource]);

  const lastBuild = resource.builds[0];

  const provider = gitRepository?.gitOrganization?.provider;

  const gitRepo =
    gitRepository && provider === models.EnumGitProvider.Github
      ? `${gitRepository.gitOrganization.name}/${gitRepository.name}`
      : provider === models.EnumGitProvider.Bitbucket
      ? `${gitRepository.groupName}/${gitRepository.name}`
      : undefined;

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <span>
            {resourceType === models.EnumResourceType.ProjectConfiguration
              ? "This will permanently delete the entire project and all its resources. Are you sure you want to continue?"
              : "This action cannot be undone. This will permanently delete the resource and its content. Are you sure you want to continue? "}
          </span>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <ListItem
        onClick={handleClick}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${id}`}
        near={<ResourceCircleBadge type={resource.resourceType} />}
        far={
          onDelete && (
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="trash_2"
              onClick={handleDelete}
            />
          )
        }
      >
        <EllipsisText className={`${CLASS_NAME}__title`} text={name} />

        <EllipsisText
          className={`${CLASS_NAME}__description`}
          text={description}
          maxLength={350}
        />
        <div className={`${CLASS_NAME}__git-sync`}>
          <span
            className={classNames(`${CLASS_NAME}__git-sync-repo`, {
              [`${CLASS_NAME}__git-sync-repo--not-connected`]: !gitRepo,
            })}
          >
            <Icon
              icon={gitProviderIconMap[provider]}
              size="small"
              className={`${CLASS_NAME}__git-sync-repo__icon${
                !gitRepo ? "-not-connected" : ""
              }`}
            />
            <span>{gitRepo ? gitRepo : "Not connected"}</span>
          </span>
        </div>

        <div className={`${CLASS_NAME}__recently-used`}>
          <span className={`${CLASS_NAME}__last-build`}>
            <span className={`${CLASS_NAME}__last-build__title`}>
              Last commit:{" "}
            </span>
            {lastBuild ? (
              <UserAndTime
                account={lastBuild.commit.user?.account || {}}
                time={lastBuild.createdAt}
              />
            ) : (
              <span className={`${CLASS_NAME}__last-build__not-yet`}>
                No commit yet
              </span>
            )}
          </span>
        </div>
      </ListItem>
    </>
  );
}

export default ResourceListItem;
