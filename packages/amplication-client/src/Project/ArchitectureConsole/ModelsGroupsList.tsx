import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  EnumButtonStyle,
  Tooltip,
} from "@amplication/ui/design-system";
import { Node } from "./types";
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
          <p>Filter</p>
          {modelGroups.map((model) => (
            <div className={`${CLASS_NAME}__modelGroups`}>
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
