import { ReactElement, memo, useCallback, useEffect, type FC } from "react";
import { Handle, Position, useStore, useUpdateNodeInternals } from "reactflow";
import "./ResourceNode.scss";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
  useTagColorStyle,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import * as models from "../../../models";
import { Node, NodePayload } from "../types";
import useBlueprintsMap from "../../../Blueprints/hooks/useBlueprintsMap";
import { Link } from "react-router-dom";
import { useResourceBaseUrl } from "packages/amplication-client/src/util/useResourceBaseUrl";

type Props = {
  className?: string;
  modelId: string;
  renderContent?: (data: NodePayload<models.Resource>) => ReactElement;
};

const CLASS_NAME = "catalog-graph-resource-node";

const ResourceNodeBase: FC<Props> = memo(
  ({ className, renderContent, modelId }) => {
    const sourceNode = useStore(
      useCallback(
        (store) => store.nodeInternals.get(modelId) as Node,
        [modelId]
      )
    );

    const data = sourceNode?.data as NodePayload<models.Resource>;
    const resource = data.payload;

    const { baseUrl } = useResourceBaseUrl({
      overrideResourceId: resource.id,
      overrideProjectId: resource.projectId,
    });

    const updateNodeInternals = useUpdateNodeInternals();

    const { blueprintsMapById } = useBlueprintsMap();

    const blueprint = blueprintsMapById[resource.blueprintId];

    const { borderColor } = useTagColorStyle(blueprint?.color ?? "#FFFFFF");

    useEffect(() => {
      updateNodeInternals(modelId);
    }, [blueprint, modelId, updateNodeInternals]);

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
        title={resource.description}
      >
        <Handle
          className={`${CLASS_NAME}__handle_left`}
          type="source"
          id={`node-handle-${resource.id}`}
          position={Position.Left}
          isConnectable={false}
        />
        <FlexItem
          className={`${CLASS_NAME}__header`}
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
        >
          <Text className={`${CLASS_NAME}__title`} textStyle={EnumTextStyle.H4}>
            <Link to={baseUrl}>{resource.name}</Link>
          </Text>
        </FlexItem>
        <FlexItem
          gap={EnumGapSize.Small}
          direction={EnumFlexDirection.Column}
          margin={EnumFlexItemMargin.Both}
          itemsAlign={EnumItemsAlign.Stretch}
        >
          <FlexItem
            direction={EnumFlexDirection.Row}
            itemsAlign={EnumItemsAlign.End}
          >
            <Text
              textStyle={EnumTextStyle.Tag}
              textColor={EnumTextColor.ThemeTurquoise}
            >
              Relations
            </Text>
          </FlexItem>
          {blueprint?.relations?.map((relation) => (
            <Relation
              relation={relation}
              key={relation.key}
              resource={resource}
            />
          ))}
        </FlexItem>
        <Handle
          className={`${CLASS_NAME}__handle_right`}
          type="source"
          id={`node-handle-${resource.id}`}
          position={Position.Right}
          isConnectable={false}
        />{" "}
        {renderContent && renderContent(data)}
      </div>
    );
  }
);

interface RelationProps {
  resource: models.Resource;
  relation: models.BlueprintRelation;
}

const Relation = memo(({ relation, resource }: RelationProps) => {
  return (
    <div className={`${CLASS_NAME}__handles-container`}>
      <Handle
        className={`${CLASS_NAME}__handle_left`}
        type="source"
        id={`relation-handle-${resource.id}-${relation.key}`}
        position={Position.Left}
        isConnectable={false}
      />

      <div className="catalog-graph-resource-node__child-item">
        <Text
          textStyle={EnumTextStyle.Description}
          textColor={EnumTextColor.White}
        >
          <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
            <Icon size="xsmall" icon="relation" color={EnumTextColor.Black20} />
            <span>{relation?.name}</span>
          </FlexItem>
        </Text>
      </div>

      <Handle
        className={`${CLASS_NAME}__handle_right`}
        type="source"
        id={`relation-handle-${resource.id}-${relation.key}`}
        position={Position.Right}
        isConnectable={false}
      />
    </div>
  );
});

Relation.displayName = "Column";

export default ResourceNodeBase;
