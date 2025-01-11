import { useContext } from "react";

import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { AppContext } from "../context/appContext";
import { EnumResourceTypeGroup } from "../models";
import "./PendingChangesList.scss";
import PendingChangesListGroup from "./PendingChangesListGroup";

const CLASS_NAME = "pending-changes-list";

type Props = {
  resourceTypeGroup: EnumResourceTypeGroup;
};

const PendingChangesList = ({ resourceTypeGroup }: Props) => {
  const { currentProject } = useContext(AppContext);

  const { pendingChangesByResourceAndType } = usePendingChanges(
    currentProject,
    resourceTypeGroup
  );

  return (
    <div className={CLASS_NAME}>
      {pendingChangesByResourceAndType.map((resourceGroup) => (
        <div key={resourceGroup.resource.id}>
          <div className={`${CLASS_NAME}__changes__resource`}>
            <ResourceTypeBadge
              resource={resourceGroup.resource}
              size="xsmall"
            />
            <span>{resourceGroup.resource.name}</span>
          </div>
          {resourceGroup.changes.map((typeGroup) => (
            <PendingChangesListGroup key={typeGroup.type} group={typeGroup} />
          ))}
        </div>
      ))}
      {pendingChangesByResourceAndType.length === 0 && (
        <>
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
          >
            <SvgThemeImage
              image={
                resourceTypeGroup === EnumResourceTypeGroup.Platform
                  ? EnumImages.AddResource
                  : EnumImages.NoChanges
              }
            />
            <Text
              textStyle={EnumTextStyle.Description}
              textAlign={EnumTextAlign.Center}
            >
              {resourceTypeGroup === EnumResourceTypeGroup.Platform
                ? "No platform changes! keep working."
                : "No pending changes! keep working."}
            </Text>
          </FlexItem>
        </>
      )}
    </div>
  );
};

export default PendingChangesList;
