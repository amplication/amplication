import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { CreatePluginInstallationArgs } from './dto/CreatePluginInstallationArgs';
import { FindManyPluginInstallationArgs } from './dto/FindManyPluginInstallationArgs';
import { PluginInstallation } from './dto/PluginInstallation';
import { UpdatePluginInstallationArgs } from './dto/UpdatePluginInstallationArgs';

@Injectable()
export class PluginInstallationService extends BlockTypeService<
  PluginInstallation,
  FindManyPluginInstallationArgs,
  CreatePluginInstallationArgs,
  UpdatePluginInstallationArgs
> {
  blockType = EnumBlockType.PluginInstallation;

  constructor() {
    super();
    //super(blockService); return this after merging with the message broker branch
  }
}
