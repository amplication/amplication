import cli from "cli-ux";
import { ConfiguredCommand } from "../../configured-command";
import { getEntity } from "../../api";
import { format } from "../../flags/format-flag";
import { entity } from "../../flags/entity-flag";
import { ENTITY_COLUMNS } from "./index";
export default class EntityInfo extends ConfiguredCommand {
  static description = "show detailed information for an entity";

  static examples = [
    "amp entities:info",
    "amp entities:info -e ckm1wl4ru58969go3n3mt2zkg2",
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    entity: entity({
      required: true,
    }),
  };

  async command() {
    const { flags } = this.parse(EntityInfo);

    const entityId = flags.entity;

    const data = await getEntity(this.client, entityId);
    this.output(data, flags, ENTITY_COLUMNS);
  }
}
