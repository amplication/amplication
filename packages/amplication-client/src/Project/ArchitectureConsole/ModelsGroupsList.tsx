import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  EnumButtonStyle,
  EnumTextStyle,
  Tooltip,
  Text,
} from "@amplication/ui/design-system";
import { Node, ResourceNode } from "./types";
import "./ModelGroupList.scss";
import { Resource } from "../../models";
import ModelsTool from "./ModelsTool";

const CLASS_NAME = "model-group-list";

type Props = {
  modelGroups: Node[];
  selectedNode: Node;
  readOnly: boolean;
  handleModelGroupFilterChanged: (event: any, modelGroup: Node) => void;
  handleServiceCreated: (newResource: Resource) => void;
  onCancelChanges: () => void;
};

export default function ModelsGroupsList({
  modelGroups,
  selectedNode,
  readOnly,
  handleModelGroupFilterChanged,
  handleServiceCreated,
  onCancelChanges,
}: Props) {
  return (
    <>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__filter`}>
          {selectedNode && (
            <>
              <div className={`${CLASS_NAME}__selectedNode`}>
                <Button
                  key={selectedNode?.id}
                  icon="services"
                  iconSize="xsmall"
                  buttonStyle={EnumButtonStyle.Text}
                ></Button>
              </div>
              <hr className="amp-horizontal-rule amp-horizontal-rule--black5" />
            </>
          )}
          <Text textStyle={EnumTextStyle.Tag}>{"Filter"}</Text>

          {modelGroups.map((model: ResourceNode) => (
            <div
              className={`${CLASS_NAME}__modelGroups`}
              style={{ borderColor: model.data.groupColor }}
            >
              <Tooltip
                className="amp-menu-item__tooltip"
                aria-label={model.data.payload.name}
                direction="nw"
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
        {!readOnly && (
          <ModelsTool
            handleServiceCreated={handleServiceCreated}
            onCancelChanges={onCancelChanges}
          ></ModelsTool>
        )}
      </div>
    </>
  );
}
