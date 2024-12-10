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
import { memo, useCallback, type FC } from "react";
import { useStore, type NodeProps } from "reactflow";
import { GroupNode as GroupNodeType, GroupNodePayload } from "../types";
import "./GroupNode.scss";

type ModelProps = NodeProps & {
  data: GroupNodePayload;
};

const CLASS_NAME = "catalog-graph-group-node";

const GroupNode: FC<ModelProps> = memo(({ id }) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as GroupNodeType, [id])
  );
  const data = sourceNode?.data;

  const style = { borderTopColor: data.color };

  return (
    data && (
      <div
        className={classNames(`${CLASS_NAME}`, {
          [`${CLASS_NAME}--highlight`]: data.highlight,
        })}
        tabIndex={0}
        style={style}
        title={data.payload.name}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Start}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Column}
        >
          <FlexItem contentAlign={EnumContentAlign.Space}>
            <Text textStyle={EnumTextStyle.Normal}>{data.payload.name}</Text>
          </FlexItem>
        </FlexItem>

        <HorizontalRule />
      </div>
    )
  );
});
GroupNode.displayName = "GroupNode";

export default GroupNode;
