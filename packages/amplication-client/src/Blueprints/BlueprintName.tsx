import { Tag } from "@amplication/ui/design-system";

import * as models from "../models";

type Props = {
  blueprint: models.Blueprint;
};

const BlueprintName = ({ blueprint }: Props) => {
  return <Tag value={blueprint?.name || "unknown"} color={blueprint?.color} />;
};

export default BlueprintName;
