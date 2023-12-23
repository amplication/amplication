import { memo, type FC, useContext, useCallback } from "react";
import { Handle, Position, type NodeProps, useStore } from "reactflow";

import * as models from "../../../models";
import { CLASS_NAME } from "../ArchitectureConsole";
import { AppContext } from "../../../context/appContext";
import { Link } from "react-router-dom";
import { Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
import { EntityNode, NodePayload } from "../types";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};

const ModelSimpleNode: FC<ModelProps> = memo(({ id }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as EntityNode, [id])
  );
  const data = sourceNode?.data;

  return (
    <div
      className={classNames(`${CLASS_NAME}__node_container`, {
        "model-with-pending-changes":
          data.originalParentNode &&
          data.originalParentNode !== sourceNode.parentNode,
      })}
      tabIndex={0}
      style={{ borderSpacing: 0 }}
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
        {data.payload.displayName}
        <Link
          className={`${CLASS_NAME}__display_icon`}
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities/${data.payload.id}`}
        >
          <Icon icon="edit_2" size="small" />
        </Link>
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
