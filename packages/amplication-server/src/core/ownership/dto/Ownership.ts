import { Field, ObjectType } from "@nestjs/graphql";
import { Owner } from "./Owner";
import { Team, User } from "../../../models";

export enum EnumOwnershipType {
  Team = "Team",
  User = "User",
}

@ObjectType({
  isAbstract: true,
})
export class Ownership {
  id!: string;

  ownershipType: EnumOwnershipType;

  @Field(() => Owner, {
    nullable: false,
  })
  owner: User | Team;
}
