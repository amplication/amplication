import { Tag } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { Resource } from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  serviceTemplate: Resource;
};

const COLOR = "#F5B82E";

function ServiceTemplateChip({ serviceTemplate }: Props) {
  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: serviceTemplate?.id,
    overrideProjectId: serviceTemplate?.projectId,
    overrideIsPlatformConsole: true,
  });

  if (!serviceTemplate) {
    return null;
  }

  return (
    <Link to={`${baseUrl}`}>
      <Tag color={COLOR} value={serviceTemplate.name} />
    </Link>
  );
}

export default ServiceTemplateChip;
