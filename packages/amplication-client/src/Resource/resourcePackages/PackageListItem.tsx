import {
  ClickableListItemWithInnerActions,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import * as models from "../../models";
import { useAppContext } from "../../context/appContext";
import { DeletePackage } from "./DeletePackage";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import usePackage from "../hooks/usePackage";

type Props = {
  packageItem: models.Package;
};

export const PackageListItem = ({ packageItem }: Props) => {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();
  const history = useHistory();
  const { findPackagesRefetch } = usePackage();

  const handleDeletePackage = useCallback(() => {
    findPackagesRefetch();
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/packages`
    );
  }, [
    history,
    currentWorkspace?.id,
    currentProject?.id,
    currentResource?.id,
    findPackagesRefetch,
  ]);

  if (!packageItem) return null;

  const packageUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/packages/installed/${packageItem.id}`;

  return (
    <ClickableListItemWithInnerActions
      to={packageUrl}
      endAction={
        <FlexItem>
          <DeletePackage
            packageItem={packageItem}
            onDelete={handleDeletePackage}
          />
        </FlexItem>
      }
    >
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {packageItem.displayName}
      </Text>
    </ClickableListItemWithInnerActions>
  );
};
