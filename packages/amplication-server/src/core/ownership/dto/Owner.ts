import { createUnionType } from "@nestjs/graphql";
import { Team, User } from "../../../models";

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const Owner = createUnionType({
  name: "Owner",
  types: () => [User, Team],
  resolveType(value) {
    if (value.name) {
      return Team;
    }
    return User;
  },
});
