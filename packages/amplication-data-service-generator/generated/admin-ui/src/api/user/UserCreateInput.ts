import { InputJsonValue } from "../../types";
import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
import { UserCreateNestedManyWithoutUsersInput } from "./UserCreateNestedManyWithoutUsersInput";
import { OrganizationCreateNestedManyWithoutUsersInput } from "./OrganizationCreateNestedManyWithoutUsersInput";
import { ProfileWhereUniqueInput } from "../profile/ProfileWhereUniqueInput";

export type UserCreateInput = {
  username: string;
  password: string;
  roles: InputJsonValue;
  name: string;
  bio: string;
  email: string;
  age: number;
  birthDate: Date;
  score: number;
  manager?: UserWhereUniqueInput | null;
  employees?: UserCreateNestedManyWithoutUsersInput;
  organizations?: OrganizationCreateNestedManyWithoutUsersInput;
  interests?: Array<"programming" | "design">;
  priority: "high" | "medium" | "low";
  isCurious: boolean;
  location: string;
  extendedProperties: InputJsonValue;
  profile?: ProfileWhereUniqueInput | null;
};
