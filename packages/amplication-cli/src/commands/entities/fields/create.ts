import cli from "cli-ux";
import { ConfiguredCommand } from "../../../configured-command";
import { flags } from "@oclif/command";
import chalk from "chalk";
import { createFieldByDisplayName } from "../../../api";
import { format } from "../../../flags/format-flag";
import { entity } from "../../../flags/entity-flag";
import { FIELD_COLUMNS } from "./index";
import { AMP_CURRENT_FIELD } from "../../../properties";

export default class FieldsCreate extends ConfiguredCommand {
  static description = "create a field";

  static examples = [
    'amp entities:fields:create "Start Date" --set-current',
    'amp entities:fields:create "Start Date" -e ckm1wl4ru58969go3n3mt2zkg2',
    'amp entities:fields:create "Start Date"',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    entity: entity({
      required: true,
    }),
    ["set-current"]: flags.boolean({
      default: false,
      description: "set the newly created field as the current field",
    }),
  };

  static args = [
    {
      name: "displayName",
      required: true,
      description: "display name of field to create",
    },
  ];

  async command() {
    const { args, flags } = this.parse(FieldsCreate);

    const displayName = args.displayName;
    const { entity } = flags;

    cli.action.start(`Creating new field ${chalk.green.bold(displayName)} `);

    const data = await createFieldByDisplayName(this.client, {
      displayName: displayName,
      entity: {
        connect: {
          id: entity,
        },
      },
    });

    if (flags["set-current"] === true) {
      this.setConfig(AMP_CURRENT_FIELD, data.id);
      this.log(`Property updated - ${AMP_CURRENT_FIELD}=${data.id}`);
    }

    cli.action.stop();
    this.output(data, flags, FIELD_COLUMNS);
  }
}
