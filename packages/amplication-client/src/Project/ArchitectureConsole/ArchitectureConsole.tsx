import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  EnumButtonStyle,
  SearchField,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";
import { ModelChanges } from "./types";
import useArchitectureConsole from "./hooks/useArchitectureConsole";
import * as models from "../../models";

export const CLASS_NAME = "architecture-console";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  const {
    loadingResources,
    resourcesError,
    createResourceEntities,
    handleSearchChange,
    filteredResources,
    handleResourceFilterChanged,
  } = useArchitectureConsole();

  const handleApplyPlan = useCallback((data: ModelChanges) => {
    data.newServices.forEach((service) => {
      //todo: create new resource
      //update target resourceId in moveEntities list
    });

    createResourceEntities({
      variables: {
        data: {
          entitiesToCopy: data.movedEntities,
          //...data,
        },
      },
    }).catch(console.error);
  }, []);

  const errorMessage = resourcesError && formatError(resourcesError);

  return (
    <>
      <div className={`${CLASS_NAME}__resources`}>
        <span>Filtered</span>
        {filteredResources?.map(
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
        {filteredResources?.map(
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
      <ModelOrganizer
        resources={filteredResources.filter((r) => r.isFilter)}
        onApplyPlan={handleApplyPlan}
        loadingResources={loadingResources}
        errorMessage={errorMessage}
      />
    </>
  );
}
