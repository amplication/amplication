import { useContext } from "react";
import PendingChange from "./PendingChange";

import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { AppContext } from "../context/appContext";
import "./PendingChangesList.scss";
import { EnumTextStyle, Text } from "@amplication/ui/design-system";

const CLASS_NAME = "pending-changes-list";

const PendingChangesList = () => {
  const { currentProject } = useContext(AppContext);

  const { pendingChangesByResource } = usePendingChanges(currentProject);

  return (
    <div className={CLASS_NAME}>
      {pendingChangesByResource.map((group) => (
        <div key={group.resource.id}>
          <div className={`${CLASS_NAME}__changes__resource`}>
            <ResourceCircleBadge
              type={group.resource.resourceType}
              size="xsmall"
            />
            <span>{group.resource.name}</span>
          </div>
          {group.changes.map((change) => (
            <PendingChange key={change.originId} change={change} linkToOrigin />
          ))}
        </div>
      ))}
      {pendingChangesByResource.length === 0 && (
        <Text textStyle={EnumTextStyle.Description}>
          No pending changes! keep working.
        </Text>
      )}
    </div>
  );
};

export default PendingChangesList;
