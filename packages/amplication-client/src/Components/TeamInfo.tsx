import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
  UserAvatar,
  useTagColorStyle,
} from "@amplication/ui/design-system";
import { Team } from "../models";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const CLASS_NAME = "team-info";

type Props = {
  team: Team;
  linkToTeam?: boolean;
};

export const TeamInfo = ({ team, linkToTeam = false }: Props) => {
  const { currentWorkspace } = useAppContext();

  const teamInfoElement = (
    <FlexItem
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
      start={<UserAvatar firstName={team.name} color={team.color} />}
    >
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {team.name}
      </Text>
    </FlexItem>
  );

  return linkToTeam ? (
    <Link
      to={`/${currentWorkspace?.id}/settings//teams/${team.id}`}
      className={CLASS_NAME}
    >
      {teamInfoElement}
    </Link>
  ) : (
    teamInfoElement
  );
};
