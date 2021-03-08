import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getEntity } from '../../api';
import { format } from '../../flags/format-flag';
import { ENTITY_COLUMNS } from './index';
export default class EntityInfo extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: format(),
  };

  static args = [
    {
      name: 'ENTITY',
      required: true,
      description: 'id of entity',
    },
  ];

  async command() {
    const { args, flags } = this.parse(EntityInfo);

    const entityId = args.ENTITY;

    const data = await getEntity(this.client, entityId);
    this.output(data, flags, ENTITY_COLUMNS);
  }
}
