import { memo, type FC } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import "./modelNode.scss";

import * as models from "../../../models";
import { NodePayload } from "../types";
import ModelNodeBase from "./modelNodeBase";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};

const CLASS_NAME = "model-node";

const ModelNode: FC<ModelProps> = memo(({ id }) => {
  return (
    <ModelNodeBase
      modelId={id}
      includeModelHandles
      renderContent={(data) => (
        <div className={`${CLASS_NAME}__column_container`}>
          {data.payload.fields.map((field) => (
            <Column column={field} key={field.permanentId} />
          ))}
        </div>
      )}
    />
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
