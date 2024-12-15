import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { memo, useCallback, type FC } from "react";
import { NodeToolbar, Position, useStore, type NodeProps } from "reactflow";
import { GroupNode as GroupNodeType, GroupNodePayload } from "../types";
import "./GroupNode.scss";
import { useAppContext } from "../../../context/appContext";
import useCustomPropertiesMap from "../../../CustomProperties/hooks/useCustomPropertiesMap";
import ColoredContainer from "./ColoredContainer";

type ModelProps = NodeProps & {
  data: GroupNodePayload;
};

const CLASS_NAME = "catalog-graph-group-node";

const GroupNode: FC<ModelProps> = memo(({ id }) => {
  const {
    blueprintsMap: { blueprintsMapById },
  } = useAppContext();

  const { customPropertiesMap } = useCustomPropertiesMap();

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(id) as GroupNodeType, [id])
  );
  const data = sourceNode?.data;

  if (customPropertiesMap[data.payload.fieldKey]) {
    const property = customPropertiesMap[data.payload.fieldKey];
    data.color = property?.options?.find(
      (option) => option.value === data.payload.fieldId
    )?.color;
  }

  if (data.payload.fieldKey === "blueprint") {
    const blueprint = blueprintsMapById[data.payload.fieldId];
    data.color = blueprint?.color;
  }

  return (
    data && (
      <ColoredContainer
        color={data.color}
        className={classNames(`${CLASS_NAME}`, {
          [`${CLASS_NAME}--highlight`]: data.highlight,
          [`${CLASS_NAME}--selected`]: sourceNode.selected,
        })}
      >
        <NodeToolbar position={Position.Top} isVisible={sourceNode.selected}>
          <div className="catalog-graph-group-node__toolbar">
            <Text
              textStyle={EnumTextStyle.Description}
              textColor={EnumTextColor.White}
            >
              {`${data.payload.fieldName}: ${data.payload.name}`}
            </Text>
          </div>
        </NodeToolbar>
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
      </ColoredContainer>
    )
  );
});
GroupNode.displayName = "GroupNode";

export default GroupNode;
