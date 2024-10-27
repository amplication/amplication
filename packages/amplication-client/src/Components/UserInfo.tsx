import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
  UserAvatar,
} from "@amplication/ui/design-system";
import { User } from "../models";
import { isEmpty } from "lodash";

const CLASS_NAME = "user-info";

type Props = {
  user: User;
  showEmail?: boolean;
};

export const UserInfo = ({ user, showEmail = true }: Props) => {
  const nameIsMissing =
    isEmpty(user.account?.firstName) && isEmpty(user.account?.lastName);
  const name = nameIsMissing
    ? user.account?.email
    : `${user.account?.firstName} ${user.account?.lastName}`;

  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
      start={
        <UserAvatar
          firstName={user.account?.firstName}
          lastName={user.account?.lastName}
        />
      }
    >
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {name}
      </Text>
      {showEmail && !nameIsMissing && (
        <Text textStyle={EnumTextStyle.Tag}>{user.account?.email}</Text>
      )}
    </FlexItem>
  );
};
