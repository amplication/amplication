import React from "react";

import * as models from "../models";
import PendingChange from "./PendingChange";
import PendingChangeDiffEntity, {
  EnumCompareType,
} from "./PendingChangeDiffEntity";
import PendingChangeDiffBlock from "./PendingChangeDiffBlock";
import { PanelCollapsible } from "@amplication/ui/design-system";

import "./PendingChangeWithCompare.scss";

const CLASS_NAME = "pending-change-with-compare";

type Props = {
  change: models.PendingChange;
  compareType?: EnumCompareType;
  splitView: boolean;
};

const PendingChangeWithCompare = ({
  change,
  compareType,
  splitView,
}: Props) => {
  return (
    <PanelCollapsible
      initiallyOpen
      className={CLASS_NAME}
      headerContent={<PendingChange change={change} />}
    >
      {change.originType === models.EnumPendingChangeOriginType.Entity ? (
        <PendingChangeDiffEntity
          key={change.originId}
          change={change}
          compareType={compareType}
          splitView={splitView}
        />
      ) : (
        <PendingChangeDiffBlock
          key={change.originId}
          change={change}
          compareType={compareType}
          splitView={splitView}
        />
      )}
    </PanelCollapsible>
  );
};

export default PendingChangeWithCompare;
