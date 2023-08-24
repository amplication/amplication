import { IsString } from "class-validator";

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
  action!: "signup" | "login" | "update" | "delete";
}
