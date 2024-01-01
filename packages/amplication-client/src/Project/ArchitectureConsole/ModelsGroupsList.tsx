import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { ResourceFilter } from "./ArchitectureConsole";

export const CLASS_NAME = "architecture-console";

type Props = {
  resources: ResourceFilter[];
  handleResourceFilterChanged: (event: any, resource: ResourceFilter) => void;
};

export default function ModelsGroupsList({
  resources,
  handleResourceFilterChanged,
}: Props) {
  return (
    <>
      <div className={`${CLASS_NAME}__resources`}>
        <span>Filtered</span>
        {resources
          .filter((r) => !r.isFilter)
          .map((resource) => (
            <div className={`${CLASS_NAME}__resource`}>
              <Button
                key={resource.id}
                icon="services"
                iconSize="xsmall"
                buttonStyle={EnumButtonStyle.Text}
                onClick={(event) =>
                  handleResourceFilterChanged(event, resource)
                }
              ></Button>
            </div>
          ))}
        <span>Filter</span>
        {resources
          .filter((r) => r.isFilter)
          .map((resource) => (
            <div className={`${CLASS_NAME}__resource`}>
              <Button
                key={resource.id}
                icon="services"
                iconSize="xsmall"
                buttonStyle={EnumButtonStyle.Text}
                onClick={(event) =>
                  handleResourceFilterChanged(event, resource)
                }
              ></Button>
            </div>
          ))}
      </div>
    </>
  );
}
