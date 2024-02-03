import { memo, type FC } from "react";
import { type NodeProps } from "reactflow";
import "./modelNode.scss";

import * as models from "../../../models";
import { NodePayload } from "../types";
import ModelNodeBase from "./modelNodeBase";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};
const CLASS_NAME = "model-node";

const ModelSimpleNode: FC<ModelProps> = memo(({ id }) => {
  return (
    <ModelNodeBase
      modelId={id}
      includeModelHandles
      className={`${CLASS_NAME}--simple`}
    />
  );
});
ModelSimpleNode.displayName = "ModelSimpleNode";

export default ModelSimpleNode;
