import cli, { Table } from "cli-ux";

import { ConfiguredCommand } from "../../configured-command";
import { getEntities } from "../../api";
import { resource } from "../../flags/resource-flag";
import { format } from "../../flags/format-flag";

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
  static description = "list entities for a resource";

  static examples = [
    "amp entities",
    "amp entities -r ckm1w4vy857869go3nsw4mk2ay",
    "amp entities --format=table",
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    resource: resource(),
  };

  async command() {
    const { flags } = this.parse(EntitiesIndex);

    const resourceIdFlag = flags.resource;
    let resourceId = "";

    if (!resourceIdFlag) {
      resourceId = await cli.prompt("resource", { required: true });
    }

    const data = await getEntities(
      this.client,
      resourceIdFlag || resourceId,
      undefined,
      undefined
    );
    this.output(data, flags, ENTITY_COLUMNS);
  }
}
