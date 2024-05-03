import { TabContentTitle } from "@amplication/ui/design-system";
import React from "react";

const TITLE = "Types";
const SUB_TITLE =
  "Types are data structures that are used as DTOs, Args, and Types for actions.";

const TypeList: React.FC = () => {
  return <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />;
};

export default TypeList;
