import ResourceForm from "../Resource/ResourceForm";
import { useContext } from "react";
import { AppContext } from "../context/appContext";

function ProjectFormPage() {
  const { currentProjectConfiguration } = useContext(AppContext);

  return <ResourceForm resourceId={currentProjectConfiguration.id} />;
}

export default ProjectFormPage;
