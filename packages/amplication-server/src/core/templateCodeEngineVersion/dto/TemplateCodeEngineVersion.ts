import { IBlock } from "../../../models";
import { CodeGeneratorVersionStrategy } from "../../resource/dto";

export class TemplateCodeEngineVersion extends IBlock {
  codeGeneratorVersion?: string;
  codeGeneratorStrategy?: CodeGeneratorVersionStrategy;
}
