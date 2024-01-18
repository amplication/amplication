import { IsEmail } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { PreviewAccountType } from "./EnumPreviewAccountType";

@InputType()
export class SignupPreviewAccountInput {
  @IsEmail({}, { message: "Invalid email" })
  @Field(() => String, { nullable: false })
  previewAccountEmail!: string;

  @Field(() => PreviewAccountType, { nullable: false })
  previewAccountType!: PreviewAccountType;
}
