import { IsEmail } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { PreviewAccountType } from "./EnumPreviewAccountType";
import { IsWorkEmail } from "../IsWorkEmail";

@InputType()
export class SignupPreviewAccountInput {
  @Field({ nullable: false })
  @IsEmail()
  @IsWorkEmail({
    message: "Email must be a work email, not a public domain email",
  })
  previewAccountEmail: string;

  @Field((type) => PreviewAccountType, { nullable: false })
  previewAccountType: PreviewAccountType;
}
