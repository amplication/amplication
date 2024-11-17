import { CircleBadge, Icon, Tooltip } from "@amplication/ui/design-system";
import * as models from "../models";

type Props = {
  blueprint: models.Blueprint | null;
};

const BlueprintCircleBadge = ({ blueprint }: Props) => {
  return (
    <>
      <Tooltip title={blueprint?.name} direction="ne">
        <CircleBadge color={blueprint?.color} size={"small"}>
          <Icon icon={"blueprint"} size={"small"} />
        </CircleBadge>
      </Tooltip>
    </>
  );
};

export default BlueprintCircleBadge;
