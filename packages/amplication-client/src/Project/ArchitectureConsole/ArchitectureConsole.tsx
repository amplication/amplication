import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import { Button, Dialog, SearchField } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { formatError } from "../../util/error";
import ModelOrganizer from "./ModelOrganizer";
import { ModelChanges } from "./types";
import useArchitectureConsole from "./hooks/useArchitectureConsole";
import * as models from "../../models";
import NewTempResource from "./NewTempResource";
import ModelsGroupsList from "./ModelsGroupsList";

export const CLASS_NAME = "architecture-console";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  // const {
  //   loadingResources,
  //   resourcesError,
  //   handleSearchChange,
  //   filteredResources,
  //   handleResourceFilterChanged,
  //   loadingCreateService,
  //   loadingCreateEntities,
  //   handleNewServiceSuccess,
  //   handleApplyPlanProcess,
  // } = useArchitectureConsole();

  return (
    <>
      <ModelOrganizer
      // onApplyPlan={handleApplyPlan}
      // loadingResources={
      //   loadingResources || loadingCreateService || loadingCreateEntities
      // }
      // errorMessage={errorMessage}
      />
    </>
  );
}
