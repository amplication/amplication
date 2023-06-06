import { Field, ObjectType } from "@nestjs/graphql";
import { ErrorLevel, ErrorMessages } from "./types";

@ObjectType()
export class ErrorMessage {
  @Field(() => ErrorMessages, { nullable: false })
  message: ErrorMessages;

  @Field(() => ErrorLevel, { nullable: false })
  level: ErrorLevel;

  @Field(() => String, { nullable: true })
  details: string | null;
}
