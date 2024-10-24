import {
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import * as models from "../models";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  change: models.PendingChange;
  name: string;
  relativeUrl: string;
  linkToOrigin: boolean;
  icon: string;
  type: string;
};

const CLASS_NAME = "pending-change-content";

const PendingChangeContent = ({
  change,
  name,
  relativeUrl,
  linkToOrigin,
  icon,
  type,
}: Props) => {
  const { baseUrl } = useProjectBaseUrl();

  const isProjectConfigResourceType =
    change.resource.resourceType ===
    models.EnumResourceType.ProjectConfiguration;

  const isPrivatePlugin =
    change.originType === models.EnumPendingChangeOriginType.Block &&
    (change.origin as models.Block).blockType ===
      models.EnumBlockType.PrivatePlugin;

  const url = isProjectConfigResourceType
    ? `${baseUrl}/settings/general`
    : isPrivatePlugin
    ? `${baseUrl}/private-plugins/${change.originId}`
    : `${baseUrl}/${change.resource.id}/${relativeUrl}`;

  const nameElement = (
    <FlexItem itemsAlign={EnumItemsAlign.Center} className={CLASS_NAME}>
      <FlexItem.FlexStart className={`${CLASS_NAME}__indicator-wrapper`}>
        <Icon
          className={`${CLASS_NAME}__indicator ${CLASS_NAME}__indicator--${change.action}`}
          icon={icon}
        />
      </FlexItem.FlexStart>

      <Tooltip
        wrap
        direction={"nw"}
        aria-label={`${change.action}: ${name} `}
        className={`${CLASS_NAME}__tooltip_deleted`}
      >
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.White}
          className={`${CLASS_NAME}__name`}
        >
          {name}
        </Text>
      </Tooltip>
    </FlexItem>
  );

  return linkToOrigin &&
    change.action !== models.EnumPendingChangeAction.Delete ? (
    <Link className={`${CLASS_NAME}__link`} to={url}>
      {nameElement}
    </Link>
  ) : (
    <span className={`${CLASS_NAME}__link`}>{nameElement}</span>
  );
};
export default PendingChangeContent;
