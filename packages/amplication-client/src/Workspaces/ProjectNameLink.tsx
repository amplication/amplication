import * as models from "../models";

import DataGridLink from "../Components/DataGridLink";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  project: models.Project;
};

function ProjectNameLink({ project }: Props) {
  const { id, name } = project;

  const { baseUrl } = useProjectBaseUrl({
    overrideProjectId: id,
  });

  return <DataGridLink to={baseUrl} text={name} />;
}

export default ProjectNameLink;
