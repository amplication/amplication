import { Chip, EnumChipStyle } from "@amplication/ui/design-system";
import { Resource } from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import { Link } from "react-router-dom";

type Props = {
  serviceTemplate: Resource;
};

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
      <Chip chipStyle={EnumChipStyle.ThemeOrange}>{serviceTemplate.name}</Chip>
    </Link>
  );
}

export default ServiceTemplateChip;
