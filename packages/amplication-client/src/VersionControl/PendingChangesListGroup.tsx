import PendingChange, {
  changeOriginMap,
  EntityLinkAndDisplayName,
} from "./PendingChange";

import {
  CollapsibleListItem,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import * as models from "../models";
import { PendingChangesByType } from "../Workspaces/hooks/usePendingChanges";
import "./PendingChangesListGroup.scss";

const CLASS_NAME = "pending-changes-list-group";

type Props = {
  group: PendingChangesByType;
};

const PendingChangesListGroup = ({ group }: Props) => {
  const groupData: EntityLinkAndDisplayName = useMemo(() => {
    if (group.type === "Entity") {
      return changeOriginMap[models.EnumPendingChangeOriginType.Entity](
        group.typeChanges[0].origin
      );
    } else {
      return changeOriginMap[models.EnumPendingChangeOriginType.Block](
        group.typeChanges[0].origin
      );
    }
  }, [group]);

  return (
    <div className={`${CLASS_NAME}`}>
      <CollapsibleListItem
        initiallyExpanded
        expandable
        icon={groupData.icon}
        childItems={group.typeChanges.map((change) => (
          <PendingChange key={change.originId} change={change} linkToOrigin />
        ))}
      >
        <FlexItem
          margin={EnumFlexItemMargin.None}
          itemsAlign={EnumItemsAlign.Center}
          className={`${CLASS_NAME}__header`}
          gap={EnumGapSize.Small}
        >
          <Text textStyle={EnumTextStyle.Tag}>{groupData.type}</Text>{" "}
          {group.typeChanges.length}
        </FlexItem>
      </CollapsibleListItem>
    </div>
  );
};

export default PendingChangesListGroup;
