import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  SearchField,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";
import { ModelChanges } from "./types";
import useArchitectureConsole from "./hooks/useArchitectureConsole";
import * as models from "../../models";
import NewTempResource from "./NewTempResource";

export const CLASS_NAME = "architecture-console";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  const [newService, setNewService] = useState<boolean>(false);

  const {
    loadingResources,
    resourcesError,
    handleSearchChange,
    filteredResources,
    handleResourceFilterChanged,
    loadingCreateService,
    loadingCreateEntities,
    handleNewServiceSuccess,
    handleApplyPlanProcess,
  } = useArchitectureConsole();

  const handleNewServiceClick = useCallback(() => {
    setNewService(!newService);
  }, [newService, setNewService]);

  const handleApplyPlan = useCallback((data: ModelChanges) => {
    handleApplyPlanProcess(data);
  }, []);

  const triggerNewServiceSuccess = useCallback(
    (data: ResourceFilter) => {
      handleNewServiceSuccess(data);

      setNewService(false);
    },
    [newService, setNewService]
  );

  const errorMessage = resourcesError && formatError(resourcesError);

  return (
    <>
      <div className={`${CLASS_NAME}__resources`}>
        <span>Filtered</span>
        {filteredResources.map(
          (resource) =>
            !resource.isFilter && (
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
            )
        )}
        <span>Filter</span>
        {filteredResources.map(
          (resource) =>
            resource.isFilter && (
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
            )
        )}
      </div>
      <SearchField
        label="search"
        placeholder="search"
        onChange={handleSearchChange}
      />
      <Button onClick={handleNewServiceClick}>+</Button>
      <Dialog
        isOpen={newService}
        onDismiss={handleNewServiceClick}
        title="New Service"
      >
        <NewTempResource onSuccess={triggerNewServiceSuccess}></NewTempResource>
      </Dialog>

      <ModelOrganizer
        resources={filteredResources.filter((r) => r.isFilter)}
        onApplyPlan={handleApplyPlan}
        loadingResources={
          loadingResources || loadingCreateService || loadingCreateEntities
        }
        errorMessage={errorMessage}
      />
    </>
  );
}
