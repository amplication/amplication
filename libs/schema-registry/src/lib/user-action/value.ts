import { IsString } from "class-validator";

export enum UserActionType {
  SIGNUP = "signup",
  LOGIN = "login",
  UPDATE = "update",
  DELETE = "delete",
  CURRENT_WORKSPACE = "currentWorkspace",
}

export class Value {
  @IsString()
  userId!: string;

  @IsString()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  externalId!: string;

  @IsString()
  action!: UserActionType;

  @IsString()
  enableUser!: boolean;
}
