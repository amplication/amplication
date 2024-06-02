import { InputType } from "@nestjs/graphql";
import { BlockOrderByInput } from "../../block/dto/BlockOrderByInput";

@InputType({
  isAbstract: true,
})
export class ModuleDtoOrderByInput extends BlockOrderByInput {}
