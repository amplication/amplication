import cli, { Table } from "cli-ux";
import { ConfiguredCommand } from "../../../configured-command";
import { getFields } from "../../../api";
import { entity } from "../../../flags/entity-flag";
import { format } from "../../../flags/format-flag";

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
  static description = "list fields for an entity";

  static examples = [
    "amp entities:fields",
    "amp entities:fields -e ckm1wl4ru58969go3n3mt2zkg2",
    "amp entities:fields --format=table",
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    entity: entity({
      required: true,
    }),
  };

  async command() {
    const { flags } = this.parse(FieldsIndex);

    const entityIdFlag = flags.entity;
    let entityId = "";

    if (!entityIdFlag) {
      entityId = await cli.prompt("entity", { required: true });
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
