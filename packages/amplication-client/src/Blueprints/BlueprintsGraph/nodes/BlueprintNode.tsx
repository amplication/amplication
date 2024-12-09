import { memo, type FC } from "react";
import { type NodeProps } from "reactflow";

import * as models from "../../../models";
import { NodePayload } from "../types";
import BlueprintNodeBase from "./BlueprintNodeBase";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};
const CLASS_NAME = "blueprint-node";

const BlueprintNode: FC<ModelProps> = memo(({ id }) => {
  return <BlueprintNodeBase modelId={id} className={`${CLASS_NAME}--simple`} />;
});
BlueprintNode.displayName = "BlueprintNode";

export default BlueprintNode;
