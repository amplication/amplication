import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getEntity } from '../../api';

export default class EntityInfo extends ConfiguredCommand {
  static args = [
    {
      name: 'ENTITY',
      required: true,
      description: 'id of entity',
    },
  ];

  async command() {
    const { args } = this.parse(EntityInfo);

    const entityId = args.ENTITY;

    const data = await getEntity(this.client, entityId);
    cli.styledJSON(data);
  }
}
