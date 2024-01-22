import { useContext } from "react";
import PendingChange from "./PendingChange";

import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { AppContext } from "../context/appContext";
import "./PendingChangesList.scss";
import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import PendingChangesListGroup from "./PendingChangesListGroup";

const CLASS_NAME = "pending-changes-list";

const PendingChangesList = () => {
  const { currentProject } = useContext(AppContext);

  const { pendingChangesByResourceAndType } = usePendingChanges(currentProject);

  return (
    <div className={CLASS_NAME}>
      {pendingChangesByResourceAndType.map((resourceGroup) => (
        <div key={resourceGroup.resource.id}>
          <div className={`${CLASS_NAME}__changes__resource`}>
            <ResourceCircleBadge
              type={resourceGroup.resource.resourceType}
              size="xsmall"
            />
            <span>{resourceGroup.resource.name}</span>
          </div>
          {resourceGroup.changes.map((typeGroup) => (
            <PendingChangesListGroup group={typeGroup} />
          ))}
        </div>
      ))}
      {pendingChangesByResourceAndType.length === 0 && (
        <>
          <SvgThemeImage image={EnumImages.NoChanges} />
          <Text textStyle={EnumTextStyle.Description}>
            No pending changes! keep working.
          </Text>
        </>
      )}
    </div>
  );
};

export default PendingChangesList;
