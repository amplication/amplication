import cli from 'cli-ux';
import { ConfiguredCommand } from '../../../configured-command';
import { getFields } from '../../../api';
import { flags } from '@oclif/command';

export default class FieldsIndex extends ConfiguredCommand {
  static flags = {
    entity: flags.string({
      char: 'e',
      description: 'ID of the entity',
    }),
  };

  async command() {
    const { flags } = this.parse(FieldsIndex);

    const entityIdFlag = flags.entity;
    let entityId = '';

    if (!entityIdFlag) {
      entityId = await cli.prompt('entity', { required: true });
    }

    const data = await getFields(
      this.client,
      entityIdFlag || entityId,
      undefined,
      undefined
    );
    cli.styledJSON(data);
  }
}
