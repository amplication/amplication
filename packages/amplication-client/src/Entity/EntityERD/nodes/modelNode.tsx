import { memo, type FC, useContext } from "react";
import { Handle, Position } from "reactflow";

import * as models from "../../../models";
import { CLASS_NAME } from "../EntitiesERD";
import { AppContext } from "../../../context/appContext";
import { Link } from "react-router-dom";
import { Icon } from "@amplication/ui/design-system";
interface ModelProps {
  data: models.Entity;
}
const ModelNode: FC<ModelProps> = memo(({ data }) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  return (
    <div
      className={`${CLASS_NAME}__node_container`}
      tabIndex={0}
      style={{ borderSpacing: 0 }}
      title={data.description}
    >
      <div className={`${CLASS_NAME}__display_name`}>
        {data.displayName}
        <Link
          className={`${CLASS_NAME}__display_icon`}
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities/${data.id}`}
        >
          <Icon icon="edit_2" size="small" />
        </Link>
      </div>
      <div className={`${CLASS_NAME}__column_container`}>
        {data.fields.map((field) => (
          <Column column={field} key={field.permanentId} />
        ))}
      </div>
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
