import { MessagePatternCreateInput } from "./MessagePatternCreateInput";
import { InputType } from "@nestjs/graphql";

@InputType()
export class MessagePatternUpdateInput extends MessagePatternCreateInput {}
