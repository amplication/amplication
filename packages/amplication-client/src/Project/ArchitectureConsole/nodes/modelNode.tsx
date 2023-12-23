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

const ModelNode: FC<ModelProps> = memo(({ id }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as EntityNode, [id])
  );
  const data = sourceNode?.data;

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
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
      <div className={`${CLASS_NAME}__column_container`}>
        {data.payload.fields.map((field) => (
          <Column column={field} key={field.permanentId} />
        ))}
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
ModelNode.displayName = "ModelNode";

export default ModelNode;

interface ColumnProps {
  column: models.EntityField;
}

const Column = memo(({ column }: ColumnProps) => {
  return (
    <div
      key={column.permanentId}
      className={`${CLASS_NAME}__column_inner_container`}
    >
      <Handle
        className={`${CLASS_NAME}__handle_left`}
        type="source"
        id={column.permanentId}
        position={Position.Left}
        isConnectable={false}
      />

      <div className={`${CLASS_NAME}__column_display_name`}>
        <span title={column.description}>{column.displayName}</span>
        <span
          className={`${CLASS_NAME}__column_display_name_datatype`}
          title={`${column.required ? "Required" : "Not required"} ${
            column.unique ? " and unique" : ""
          }`}
        >
          {`${column.dataType}${column.required ? "" : "?"}`}
        </span>
        {column.customAttributes && (
          <span
            className={`${CLASS_NAME}__column_display_name_custom_attributes`}
          >
            {column.customAttributes}
          </span>
        )}
      </div>

      <Handle
        className={`${CLASS_NAME}__handle_right`}
        type="source"
        id={column.permanentId}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
});

Column.displayName = "Column";
