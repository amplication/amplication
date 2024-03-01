import { ReactElement, memo, useCallback, type FC } from "react";
import { Handle, Position, useStore } from "reactflow";
import "./modelNode.scss";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import classNames from "classnames";
import * as models from "../../../models";
import { EntityNode, NodePayload } from "../types";
import EntityContextMenuButton from "../../../Components/EntityContextMenuButton";

type Props = {
  className?: string;
  includeModelHandles?: boolean;
  modelId: string;
  renderContent?: (data: NodePayload<models.Entity>) => ReactElement;
};

const CLASS_NAME = "model-node";

const ModelNodeBase: FC<Props> = memo(
  ({ className, renderContent, includeModelHandles, modelId }) => {
    const sourceNode = useStore(
      useCallback(
        (store) => store.nodeInternals.get(modelId) as EntityNode,
        [modelId]
      )
    );
    const data = sourceNode?.data;

    const handleSelectRelatedEntitiesClicked = useCallback(() => {
      data.selectRelatedEntities = !data.selectRelatedEntities;
    }, [data]);

    return (
      <div
        className={classNames(
          `${CLASS_NAME}`,
          className,
          {
            "model-with-pending-changes":
              data.originalParentNode &&
              data.originalParentNode !== sourceNode.parentNode,
          },
          { [`${CLASS_NAME}--draggable`]: sourceNode.draggable },
          { [`${CLASS_NAME}--selected`]: sourceNode.selected },
          { [`${CLASS_NAME}--highlight`]: data.highlight }
        )}
        tabIndex={0}
        title={data.payload.description}
      >
        {includeModelHandles && (
          <Handle
            className={`${CLASS_NAME}__handle_left`}
            type="source"
            id={data.payload.id}
            position={Position.Left}
            isConnectable={false}
          />
        )}

        <div className={`${CLASS_NAME}__header`}>
          <Text className={`${CLASS_NAME}__title`} textStyle={EnumTextStyle.H4}>
            {data.payload.displayName}
          </Text>
          {sourceNode?.draggable && (
            <EntityContextMenuButton
              onSelectRelatedEntities={handleSelectRelatedEntitiesClicked}
            ></EntityContextMenuButton>
          )}
        </div>
        {includeModelHandles && (
          <Handle
            className={`${CLASS_NAME}__handle_right`}
            type="source"
            id={data.payload.id}
            position={Position.Right}
            isConnectable={false}
          />
        )}
        {renderContent && renderContent(data)}
      </div>
    );
  }
);

export default ModelNodeBase;
