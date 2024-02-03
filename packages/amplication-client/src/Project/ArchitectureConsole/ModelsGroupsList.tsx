import {
  Button,
  EnumButtonStyle,
  EnumTextStyle,
  Tooltip,
  Text,
  HorizontalRule,
  Icon,
} from "@amplication/ui/design-system";
import { NODE_TYPE_MODEL_GROUP, Node, ResourceNode } from "./types";
import "./ModelsGroupList.scss";
import classNames from "classnames";
import { useMemo } from "react";

const CLASS_NAME = "model-group-list";

type Props = {
  nodes: Node[];
  handleModelGroupFilterChanged: (event: any, modelGroup: Node) => void;
};

export default function ModelsGroupsList({
  nodes,
  handleModelGroupFilterChanged,
}: Props) {
  const modelGroups = useMemo(() => {
    return nodes.filter(
      (node) => node.type === NODE_TYPE_MODEL_GROUP
    ) as ResourceNode[];
  }, [nodes]);

  const editableGroup = useMemo(() => {
    return modelGroups.find((model) => model.data.isEditable);
  }, [modelGroups]);

  return (
    <>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__filter`}>
          {editableGroup && (
            <>
              <div
                className={`${CLASS_NAME}__serviceBox`}
                style={{ borderColor: editableGroup.data.groupColor }}
              >
                <Tooltip
                  className="amp-menu-item__tooltip"
                  aria-label={editableGroup.data.payload.name}
                  direction="e"
                  noDelay
                >
                  <Icon icon="services" size="small"></Icon>
                </Tooltip>
              </div>
              <HorizontalRule />
            </>
          )}
          <Text textStyle={EnumTextStyle.Subtle}>Filter</Text>

          {modelGroups.map((model: ResourceNode) => (
            <div
              key={model.id}
              className={classNames(`${CLASS_NAME}__serviceBox`, {
                [`${CLASS_NAME}__serviceBox--hidden`]: model.hidden,
              })}
              style={{
                borderColor: model.hidden ? undefined : model.data.groupColor,
              }}
            >
              <Tooltip
                className="amp-menu-item__tooltip"
                aria-label={model.data.payload.name}
                direction="e"
                noDelay
              >
                <Button
                  key={model.id}
                  icon="services"
                  iconSize="small"
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={(event) =>
                    handleModelGroupFilterChanged(event, model)
                  }
                ></Button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
