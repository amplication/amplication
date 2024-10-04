import * as models from "../models";
import { UserAndTime } from "@amplication/ui/design-system";

type Props = {
  resource: models.Resource;
  hideLabel?: boolean;
};

function ResourceLastBuild({ resource, hideLabel }: Props) {
  const lastBuild = resource.builds[0];

  return (
    <UserAndTime
      account={lastBuild?.commit?.user?.account || {}}
      time={lastBuild?.createdAt}
      label={hideLabel ? "" : "Last commit:"}
    />
  );
}

export default ResourceLastBuild;
