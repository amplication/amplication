import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { useAppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  resource: models.Resource;
};

function ResourcePendingChangesCount({ resource }: Props) {
  const { pendingChanges } = useAppContext();

  const changesCount = useMemo(() => {
    return pendingChanges.filter((change) => change.resource.id === resource.id)
      .length;
  }, [pendingChanges, resource?.id]);

  if (changesCount === 0) {
    return null;
  } else {
    return (
      <Text textColor={EnumTextColor.Black20} textStyle={EnumTextStyle.Tag}>
        {changesCount} change{changesCount > 1 ? "s" : ""}
      </Text>
    );
  }
}

export default ResourcePendingChangesCount;
