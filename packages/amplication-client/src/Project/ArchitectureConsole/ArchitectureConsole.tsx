import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import ModelOrganizer from "./ModelOrganizer";
import * as models from "../../models";

export const CLASS_NAME = "architecture-console";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  return (
    <>
      <ModelOrganizer />
    </>
  );
}
