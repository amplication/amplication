import { IsEmail } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { PreviewAccountType } from "./EnumPreviewAccountType";
import { IsWorkEmail } from "../IsWorkEmail";

@InputType()
export class SignupPreviewAccountInput {
  @IsEmail({}, { message: "Invalid email" })
  @IsWorkEmail({
    message: "Email must be a work email, not a public domain email",
  })
  @Field(() => String, { nullable: false })
  previewAccountEmail!: string;

  @Field(() => PreviewAccountType, { nullable: false })
  previewAccountType!: PreviewAccountType;
}
