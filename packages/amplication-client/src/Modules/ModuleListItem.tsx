import {
  ConfirmationDialog,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
  UserAndTime,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import useModule from "./hooks/useModule";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  module: models.Module;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const ModuleListItem = ({ module, onDelete, onError }: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const history = useHistory();

  const { deleteModule, deleteModuleLoading } = useModule();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);

    deleteModule({
      variables: {
        moduleId: module.id,
      },
    }).catch(onError);
  }, [module, deleteModule, onError]);

  const handleRowClick = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}`
    );
  }, [history, module, currentWorkspace, currentProject]);

  const isEntityModule = !isEmpty(module.entityId) ? true : false;

  const isDeleteButtonDisable = isEntityModule;

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${module.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={"are you sure you want to delete this module?"}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <ListItem onClick={handleRowClick}>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          start={
            <FlexItem
              direction={EnumFlexDirection.Column}
              gap={EnumGapSize.Small}
            >
              <Link
                title={module.name}
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}`}
              >
                <FlexItem gap={EnumGapSize.Small}>
                  <Icon icon="box" size="xsmall" />
                  <Text>{module.name}</Text>
                </FlexItem>
              </Link>
              <Text textStyle={EnumTextStyle.Subtle}>{module.description}</Text>
            </FlexItem>
          }
          end={
            !deleteModuleLoading && (
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="trash_2"
                onClick={handleDelete}
                disabled={isDeleteButtonDisable}
              />
            )
          }
        ></FlexItem>

        <FlexItem
          contentAlign={EnumContentAlign.Center}
          itemsAlign={EnumItemsAlign.Center}
          // start={
          //   <UserAndTime
          //     account={latestVersion.commit?.user?.account}
          //     time={latestVersion.commit?.createdAt}
          //     label="Last commit:"
          //   />
          // }
          end={
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              contentAlign={EnumContentAlign.End}
              direction={EnumFlexDirection.Row}
            >
              {module.lockedByUser && (
                <UserAndTime
                  account={module.lockedByUser.account || {}}
                  time={module.lockedAt}
                  label="Locked:"
                  valueColor={EnumTextColor.ThemeRed}
                />
              )}
            </FlexItem>
          }
        ></FlexItem>
      </ListItem>
    </>
  );
};
