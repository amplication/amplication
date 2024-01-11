import { BlockTypeWhereInput } from "../../block/dto";
import { InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ModuleWhereInput extends BlockTypeWhereInput {}
