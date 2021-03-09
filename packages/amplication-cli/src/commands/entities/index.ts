import cli, { Table } from 'cli-ux';

import { ConfiguredCommand } from '../../configured-command';
import { getEntities } from '../../api';
import { app } from '../../flags/app-flag';
import { format } from '../../flags/format-flag';

export const ENTITY_COLUMNS: Table.table.Columns<any> = {
  id: {},
  name: {},
  description: {},
  displayName: {},
  lockedByUserId: {},
  lockedAt: {},
  lockedBy: {
    get: (row) =>
      `${row.lockedByUser?.account?.firstName} ${row.lockedByUser?.account?.lastName}`,
  },
  createdAt: {},
  updatedAt: {},
};

export default class EntitiesIndex extends ConfiguredCommand {
  static description = 'list entities for an app';

  static examples = [
    'amp entities',
    'amp entities -a ckm1w4vy857869go3nsw4mk2ay',
    'amp entities --format=table',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    app: app(),
  };

  async command() {
    const { flags } = this.parse(EntitiesIndex);

    const appIdFlag = flags.app;
    let appId = '';

    if (!appIdFlag) {
      appId = await cli.prompt('app', { required: true });
    }

    const data = await getEntities(
      this.client,
      appIdFlag || appId,
      undefined,
      undefined
    );
    this.output(data, flags, ENTITY_COLUMNS);
  }
}
