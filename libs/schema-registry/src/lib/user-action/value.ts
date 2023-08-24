import { IsString } from "class-validator";

export enum UserActionType {
  SIGNUP = "signup",
  LOGIN = "login",
  UPDATE = "update",
  DELETE = "delete",
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
  notificationId!: string;

  @IsString()
  action!: UserActionType;
}
