import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { Node } from "./types";
export const CLASS_NAME = "architecture-console";

type Props = {
  modelGroups: Node[];
  handleModelGroupFilterChanged: (event: any, modelGroup: Node) => void;
};

export default function ModelsGroupsList({
  modelGroups,
  handleModelGroupFilterChanged,
}: Props) {
  return (
    <>
      <div className={`${CLASS_NAME}__resources`}>
        <span>Filtered</span>
        {modelGroups
          .filter((model) => model.hidden)
          .map((model) => (
            <div className={`${CLASS_NAME}__resource`}>
              <Button
                key={model.id}
                icon="services"
                iconSize="xsmall"
                buttonStyle={EnumButtonStyle.Text}
                onClick={(event) => handleModelGroupFilterChanged(event, model)}
              ></Button>
            </div>
          ))}
        <span>Filter</span>
        {modelGroups
          .filter((model) => !model.hidden)
          .map((model) => (
            <div className={`${CLASS_NAME}__resource`}>
              <Button
                key={model.id}
                icon="services"
                iconSize="xsmall"
                buttonStyle={EnumButtonStyle.Text}
                onClick={(event) => handleModelGroupFilterChanged(event, model)}
              ></Button>
            </div>
          ))}
      </div>
    </>
  );
}
