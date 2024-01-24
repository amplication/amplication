import {
  Button,
  EnumButtonStyle,
  EnumTextStyle,
  Tooltip,
  Text,
  HorizontalRule,
  Icon,
} from "@amplication/ui/design-system";
import { Node, ResourceNode } from "./types";
import "./ModelsGroupList.scss";
import classNames from "classnames";

const CLASS_NAME = "model-group-list";

type Props = {
  modelGroups: Node[];
  selectedNode: ResourceNode;
  handleModelGroupFilterChanged: (event: any, modelGroup: Node) => void;
};

export default function ModelsGroupsList({
  modelGroups,
  selectedNode,
  handleModelGroupFilterChanged,
}: Props) {
  return (
    <>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__filter`}>
          {selectedNode && (
            <>
              <div
                className={`${CLASS_NAME}__serviceBox`}
                style={{ borderColor: selectedNode.data.groupColor }}
              >
                <Tooltip
                  className="amp-menu-item__tooltip"
                  aria-label={selectedNode.data.payload.name}
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
