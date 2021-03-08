import cli, { Table } from 'cli-ux';
import { ConfiguredCommand } from '../../../configured-command';
import { getFields } from '../../../api';
import { flags } from '@oclif/command';
import { format } from '../../../flags/format-flag';

export const FIELD_COLUMNS: Table.table.Columns<any> = {
  id: {},
  name: {},
  description: {},
  displayName: {},
  dataType: {},
  required: {},
  searchable: {},
  properties: {},
};

export default class FieldsIndex extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: format(),
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
    this.output(data, flags, FIELD_COLUMNS);
  }
}
