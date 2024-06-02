import cli from "cli-ux";
import { flags } from "@oclif/command";
import { ConfiguredCommand } from "../../configured-command";
import chalk from "chalk";
import { updateEntity } from "../../api";
import { format } from "../../flags/format-flag";
import { entity } from "../../flags/entity-flag";
import { ENTITY_COLUMNS } from "./index";

export default class EntitiesUpdate extends ConfiguredCommand {
  static description = "update an entity";

  static examples = [
    'amp entities:update --name="my new entity name"',
    'amp entities:update -e ckm1wl4ru58969go3n3mt2zkg2 --name "my new entity name" --description "my new entity description"',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    entity: entity({
      required: true,
    }),

    name: flags.string({
      required: false,
      description: "name of the entity",
    }),
    displayName: flags.string({
      required: false,
      description: "display name of the entity",
    }),
    pluralDisplayName: flags.string({
      required: false,
      description: "plural display name of the entity",
    }),
    description: flags.string({
      required: false,
      description: "description of the entity",
    }),
  };

  async command() {
    const { flags } = this.parse(EntitiesUpdate);

    cli.action.start(`Updating entity ${chalk.green.bold(flags.entity)} `);

    const data = await updateEntity(
      this.client,
      {
        description: flags.description,
        name: flags.name,
        displayName: flags.displayName,
        pluralDisplayName: flags.pluralDisplayName,
      },
      {
        id: flags.entity,
      }
    );

    cli.action.stop();
    this.output(data, flags, ENTITY_COLUMNS);
  }
}
