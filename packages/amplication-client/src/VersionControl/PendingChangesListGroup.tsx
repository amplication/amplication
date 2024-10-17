import PendingChange, {
  PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP,
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
      return PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP[
        models.EnumPendingChangeOriginType.Entity
      ](group.typeChanges[0].origin);
    } else {
      return PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP[
        models.EnumPendingChangeOriginType.Block
      ](group.typeChanges[0].origin);
    }
  }, [group]);

  return (
    <div className={`${CLASS_NAME}`}>
      <CollapsibleListItem
        initiallyExpanded={false}
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
          <Text textStyle={EnumTextStyle.Tag}>{groupData.pluralTypeName}</Text>{" "}
          {group.typeChanges.length}
        </FlexItem>
      </CollapsibleListItem>
    </div>
  );
};

export default PendingChangesListGroup;
