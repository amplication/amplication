import { memo, type FC, useCallback } from "react";
import { useStore, type NodeProps } from "reactflow";
import "./modelGroupNode.scss";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
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

  const style = !data.isEditable
    ? { borderTopColor: data.groupColor }
    : { borderColor: data.groupColor };

  return (
    data && (
      <div
        className={classNames(`${CLASS_NAME}`, {
          "drop-target": sourceNode.data.isCurrentDropTarget,
          [`${CLASS_NAME}--editable`]: sourceNode.data.isEditable,
          [`${CLASS_NAME}--highlight`]: data.highlight,
        })}
        tabIndex={0}
        style={style}
        title={data.payload.description}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Start}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Column}
        >
          <FlexItem contentAlign={EnumContentAlign.Space}>
            <Text textStyle={EnumTextStyle.Normal}>{data.payload.name}</Text>
          </FlexItem>
          <Text textStyle={EnumTextStyle.Description}>
            {data.payload.description}
          </Text>
        </FlexItem>

        <HorizontalRule />
      </div>
    )
  );
});
ModelGroupNode.displayName = "ModelGroupNode";

export default ModelGroupNode;
