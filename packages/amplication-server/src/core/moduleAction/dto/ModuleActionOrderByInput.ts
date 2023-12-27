import { InputType } from "@nestjs/graphql";
import { BlockOrderByInput } from "../../block/dto/BlockOrderByInput";

@InputType({
  isAbstract: true,
})
export class ModuleActionOrderByInput extends BlockOrderByInput {}
