import { ReactElement, memo, useCallback, type FC } from "react";
import { Handle, Position, useStore } from "reactflow";
import "./BlueprintNode.scss";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
  useTagColorStyle,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import * as models from "../../../models";
import { Node, NodePayload } from "../types";
import AddRelation from "./addRelation";
import EditRelation from "./editRelation";

type Props = {
  className?: string;
  modelId: string;
  renderContent?: (data: NodePayload<models.Blueprint>) => ReactElement;
};

const CLASS_NAME = "blueprint-node";

const BlueprintNodeBase: FC<Props> = memo(
  ({ className, renderContent, modelId }) => {
    const sourceNode = useStore(
      useCallback(
        (store) => store.nodeInternals.get(modelId) as Node,
        [modelId]
      )
    );
    const data = sourceNode?.data as NodePayload<models.Blueprint>;

    const { borderColor } = useTagColorStyle(data.payload.color);

    return (
      <div
        style={{
          borderTopColor: borderColor,
        }}
        className={classNames(
          `${CLASS_NAME}`,
          className,
          { [`${CLASS_NAME}--draggable`]: sourceNode.draggable },
          { [`${CLASS_NAME}--selected`]: sourceNode.selected },
          { [`${CLASS_NAME}--highlight`]: data.highlight }
        )}
        tabIndex={0}
        title={data.payload.description}
      >
        <Handle
          className={`${CLASS_NAME}__handle_left`}
          type="source"
          id={`node-handle-${data.payload.key}`}
          position={Position.Left}
          isConnectable={false}
        />
        <FlexItem
          className={`${CLASS_NAME}__header`}
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
          end={<AddRelation blueprint={data.payload} />}
        >
          <Text className={`${CLASS_NAME}__title`} textStyle={EnumTextStyle.H4}>
            {data.payload.name}
          </Text>
        </FlexItem>
        <div className={`${CLASS_NAME}__column_container`}>
          {data.payload.relations?.map((relation) => (
            <Relation
              relation={relation}
              key={relation.key}
              blueprint={data.payload}
            />
          ))}
        </div>
        <FlexItem
          direction={EnumFlexDirection.Column}
          margin={EnumFlexItemMargin.Both}
        >
          {data.payload.properties?.map((property) => (
            <Text textStyle={EnumTextStyle.Description}>{property.name}</Text>
          ))}
        </FlexItem>
        <Handle
          className={`${CLASS_NAME}__handle_right`}
          type="source"
          id={`node-handle-${data.payload.key}`}
          position={Position.Right}
          isConnectable={false}
        />{" "}
        {renderContent && renderContent(data)}
      </div>
    );
  }
);

interface RelationProps {
  blueprint: models.Blueprint;
  relation: models.BlueprintRelation;
}

const Relation = memo(({ relation, blueprint }: RelationProps) => {
  return (
    <div key={relation.key} className={`${CLASS_NAME}__column_inner_container`}>
      <Handle
        className={`${CLASS_NAME}__handle_left`}
        type="source"
        id={`relation-handle-${relation.key}`}
        position={Position.Left}
        isConnectable={false}
      />

      <EditRelation blueprint={blueprint} relation={relation} />

      <Handle
        className={`${CLASS_NAME}__handle_right`}
        type="source"
        id={`relation-handle-${relation.key}`}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
});

Relation.displayName = "Column";

export default BlueprintNodeBase;
