import { memo, type FC, useCallback } from "react";
import { useStore, type NodeProps } from "reactflow";

import "./modelGroupNode.scss";
import {
  EnumTextStyle,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { ResourceNode, ResourceNodePayload } from "../types";

type ModelProps = NodeProps & {
  data: ResourceNodePayload;
};

const CLASS_NAME = "model-group-node";

const ModelGroupNode: FC<ModelProps> = memo(({ id }) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as ResourceNode, [id])
  );
  const data = sourceNode?.data;

  return (
    data && (
      <div
        className={classNames(`${CLASS_NAME}`, {
          "drop-target": sourceNode.data.isCurrentDropTarget,
        })}
        tabIndex={0}
        style={{ borderTopColor: data.groupColor }}
        title={data.payload.description}
      >
        <Text textStyle={EnumTextStyle.H3}>{data.payload.name}</Text>

        <HorizontalRule />
      </div>
    )
  );
});
ModelGroupNode.displayName = "ModelGroupNode";

export default ModelGroupNode;
