import { Inject, Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockValuesExtended } from "../block/types";
import { CodeGeneratorVersionStrategy } from "../resource/dto";
import { TemplateCodeEngineVersion } from "./dto/TemplateCodeEngineVersion";

const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME =
  "Template Code Engine Version";
const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION =
  "This block is used to store the history of the code engine used in each version of the template.";

export const DEFAULT_VALUE: Omit<
  BlockValuesExtended<TemplateCodeEngineVersion>,
  "id"
> = {
  blockType: EnumBlockType.CodeEngineVersion,
  description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
  displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
  codeGeneratorStrategy: CodeGeneratorVersionStrategy.LatestMajor,
  codeGeneratorVersion: "",
};

@Injectable()
export class TemplateCodeEngineVersionService {
  @Inject()
  private readonly blockService: BlockService;

  async update(
    serviceTemplateId: string,
    codeGeneratorVersion: string,
    codeGeneratorStrategy: CodeGeneratorVersionStrategy,
    user: User
  ): Promise<TemplateCodeEngineVersion> {
    const currentValue = await this.getCurrent(serviceTemplateId);

    if (!currentValue) {
      return this.blockService.create<TemplateCodeEngineVersion>(
        {
          data: {
            resource: {
              connect: {
                id: serviceTemplateId,
              },
            },
            ...DEFAULT_VALUE,
          },
        },
        user.id
      );
    } else {
      return this.blockService.update<TemplateCodeEngineVersion>(
        {
          where: { id: currentValue.id },
          data: {
            ...{
              displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
              codeGeneratorVersion,
              codeGeneratorStrategy,
            },
          },
        },
        user
      );
    }
  }

  async getCurrent(
    serviceTemplateId: string
  ): Promise<TemplateCodeEngineVersion> {
    const [templateCodeEngineVersion] =
      await this.blockService.findManyByBlockType<TemplateCodeEngineVersion>(
        {
          where: {
            resource: {
              id: serviceTemplateId,
            },
          },
        },
        EnumBlockType.CodeEngineVersion
      );
    return templateCodeEngineVersion;
  }
}
