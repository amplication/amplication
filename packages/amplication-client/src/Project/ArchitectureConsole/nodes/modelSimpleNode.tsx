import { memo, useCallback, useContext, type FC } from "react";
import { Handle, Position, useStore, type NodeProps } from "reactflow";
import "./modelNode.scss";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import classNames from "classnames";
import { AppContext } from "../../../context/appContext";
import * as models from "../../../models";
import { EntityNode, NodePayload } from "../types";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};
const CLASS_NAME = "model-node";

const ModelSimpleNode: FC<ModelProps> = memo(({ id }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as EntityNode, [id])
  );
  const data = sourceNode?.data;

  return (
    <div
      className={classNames(`${CLASS_NAME}`, `${CLASS_NAME}--simple`, {
        "model-with-pending-changes":
          data.originalParentNode &&
          data.originalParentNode !== sourceNode.parentNode,
      })}
      tabIndex={0}
      title={data.payload.description}
    >
      <Handle
        className={`${CLASS_NAME}__handle_left`}
        type="source"
        id={data.payload.id}
        position={Position.Left}
        isConnectable={false}
      />
      <div className={`${CLASS_NAME}__display_name`}>
        <Text textStyle={EnumTextStyle.H4}>{data.payload.displayName}</Text>
      </div>
      <Handle
        className={`${CLASS_NAME}__handle_right`}
        type="source"
        id={data.payload.id}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
});
ModelSimpleNode.displayName = "ModelSimpleNode";

export default ModelSimpleNode;
