import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  EnumButtonStyle,
  SearchField,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useState } from "react";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";
import { ModelChanges } from "./types";
import useArchitectureConsole from "./hooks/useArchitectureConsole";

export const CLASS_NAME = "architecture-console";

type ResourceFilter = {
  id: string;
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  const {
    resourcesData,
    loadingResources,
    resourcesError,
    createResourceEntities,
    handleSearchChange,
  } = useArchitectureConsole();
  const [resourcesFilter, setResourcesFilter] = useState<ResourceFilter[]>([]);

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

  useEffect(() => {
    if (!resourcesData) return;

    if (resourcesFilter.length > 0) return;
    const filterArray = [];
    resourcesData.resources.forEach((x) => {
      const resourceFilter: ResourceFilter = {
        id: x.id,
        isFilter: true,
      };

      filterArray.push(resourceFilter);
    });
    setResourcesFilter(filterArray);
  }, [resourcesData, setResourcesFilter, resourcesFilter]);

  const handleResourceFilterChanged = useCallback(
    (event, resource: ResourceFilter) => {
      const currentResource = resourcesFilter.find((x) => x.id === resource.id);
      currentResource.isFilter = !currentResource.isFilter;

      setResourcesFilter((resourcesFilter) => [...resourcesFilter]);
    },
    [resourcesFilter, setResourcesFilter]
  );

  const errorMessage = resourcesError && formatError(resourcesError);

  return (
    <>
      <div className={`${CLASS_NAME}__resources`}>
        <span>Filtered</span>
        {resourcesFilter?.map(
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
        {resourcesFilter?.map(
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
        resources={resourcesData?.resources}
        onApplyPlan={handleApplyPlan}
        loadingResources={loadingResources}
        errorMessage={errorMessage}
      />
    </>
  );
}
