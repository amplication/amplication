import { TabContentTitle } from "@amplication/ui/design-system";
import React from "react";

const TITLE = "Actions";
const SUB_TITLE =
  "Actions are used to perform operations on resources, with or without API endpoints.";

const ActionList: React.FC = () => {
  return <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />;
};

export default ActionList;
