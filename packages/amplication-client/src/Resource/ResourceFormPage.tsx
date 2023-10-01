import { match } from "react-router-dom";
import ResourceForm from "./ResourceForm";

type Props = {
  match: match<{ resource: string }>;
};

function ResourceFormPage({ match }: Props) {
  const resourceId = match.params.resource;

  return <ResourceForm resourceId={resourceId} />;
}

export default ResourceFormPage;
