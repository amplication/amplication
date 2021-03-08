import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { flags } from '@oclif/command';
import { getEntity } from '../../api';

export default class EntityInfo extends ConfiguredCommand {
  static flags = {
    entity: flags.string({
      char: 'e',
      description: 'ID of the entity',
    }),
  };

  async command() {
    const { flags } = this.parse(EntityInfo);

    const entityIdFlag = flags.entity;
    let entityId = '';

    if (!entityIdFlag) {
      entityId = await cli.prompt('entity', { required: true });
    }

    const data = await getEntity(this.client, entityIdFlag || entityId);
    cli.styledJSON(data);
  }
}
