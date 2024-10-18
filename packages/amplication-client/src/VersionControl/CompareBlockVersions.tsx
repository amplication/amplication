import {
  CodeCompare,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  PanelCollapsible,
  Text,
} from "@amplication/ui/design-system";
import omitDeep from "deepdash/omitDeep";
import { useMemo } from "react";
import YAML from "yaml";
import * as models from "../models";
import { EnumPendingChangeOriginType } from "../models";
import { PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP } from "./PendingChange";

const CLASS_NAME = "pending-change-diff";

const CHANGE_ORIGIN_TYPE = EnumPendingChangeOriginType.Block;

enum EnumActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

const NON_COMPARABLE_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

type Props = {
  oldVersion: models.BlockVersion;
  newVersion: models.BlockVersion;
};

const ACTION_TYPE_TO_DISPLAY_MAP: {
  [key in EnumActionType]: {
    label: string;
    color: EnumTextColor;
  };
} = {
  [EnumActionType.CREATE]: {
    label: "Added",
    color: EnumTextColor.ThemeGreen,
  },
  [EnumActionType.UPDATE]: {
    label: "Updated",
    color: EnumTextColor.ThemeBlue,
  },
  [EnumActionType.DELETE]: {
    label: "Removed",
    color: EnumTextColor.ThemeRed,
  },
};

const CompareBlockVersions = ({ oldVersion, newVersion }: Props) => {
  const newValue = useMemo(() => {
    return getBlockVersionYAML(newVersion);
  }, [newVersion]);

  const oldValue = useMemo(() => {
    return getBlockVersionYAML(oldVersion);
  }, [oldVersion]);

  const actionType = useMemo(() => {
    if (oldVersion && !newVersion) {
      return EnumActionType.DELETE;
    }
    if (!oldVersion && newVersion) {
      return EnumActionType.CREATE;
    }
    return EnumActionType.UPDATE;
  }, [oldVersion, newVersion]);

  const block = newVersion?.block || oldVersion?.block;

  const headerContent = (
    <FlexItem>
      <Text
        singleLineEllipsis
        textStyle={EnumTextStyle.Description}
        textColor={ACTION_TYPE_TO_DISPLAY_MAP[actionType].color}
      >
        {PENDING_CHANGE_TO_DISPLAY_DETAILS_MAP[CHANGE_ORIGIN_TYPE](block).type}{" "}
        {ACTION_TYPE_TO_DISPLAY_MAP[actionType].label}
      </Text>

      <FlexItem.FlexEnd>
        <Text
          singleLineEllipsis
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.White}
        >
          {newVersion?.displayName}
        </Text>
      </FlexItem.FlexEnd>
    </FlexItem>
  );

  return (
    <PanelCollapsible
      noPadding
      headerContent={headerContent}
      initiallyOpen={true}
      className={CLASS_NAME}
    >
      <CodeCompare oldVersion={oldValue} newVersion={newValue} />
    </PanelCollapsible>
  );
};

function getBlockVersionYAML(data: models.BlockVersion): string {
  if (!data) return "";
  const { settings, ...rest } = data;

  const flatData = {
    ...rest,
    ...(settings || {}),
  };

  return YAML.stringify(omitDeep(flatData, NON_COMPARABLE_PROPERTIES));
}

export default CompareBlockVersions;
