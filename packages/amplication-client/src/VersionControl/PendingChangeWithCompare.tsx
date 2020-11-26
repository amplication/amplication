import React from "react";

import * as models from "../models";
import PendingChange from "./PendingChange";
import PendingChangeDiff, { EnumCompareType } from "./PendingChangeDiff";
import { PanelCollapsible } from "../Components/PanelCollapsible";

import "./PendingChangeWithCompare.scss";

const CLASS_NAME = "pending-change-with-compare";

type Props = {
  change: models.PendingChange;
  compareType?: EnumCompareType;
};

const PendingChangeWithCompare = ({ change, compareType }: Props) => {
  return (
    <PanelCollapsible
      initiallyOpen
      className={CLASS_NAME}
      headerContent={<PendingChange change={change} />}
    >
      <PendingChangeDiff
        key={change.resourceId}
        change={change}
        compareType={compareType}
      />
    </PanelCollapsible>
  );
};

export default PendingChangeWithCompare;
