import { InputType } from "@nestjs/graphql";
import { MessagePatternCreateInput } from "./MessagePatternCreateInput";

@InputType()
export class MessagePatternUpdateInput extends MessagePatternCreateInput {}
