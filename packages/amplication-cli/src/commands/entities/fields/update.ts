import cli from "cli-ux";
import { flags } from "@oclif/command";
import { ConfiguredCommand } from "../../../configured-command";
import chalk from "chalk";
import { updateField } from "../../../api";
import { format } from "../../../flags/format-flag";
import { field } from "../../../flags/field-flag";
import { FIELD_COLUMNS } from "./index";

export default class FieldsUpdate extends ConfiguredCommand {
  static description = "update a field";

  static examples = [
    'amp entities:fields:update --name="my new field name"',
    'amp entities:fields:update -f ckm1xt4mm63197go3nt8n2py80 --name "my new field name"',
    "amp entities:fields:update --required",
    "amp entities:fields:update --no-required",
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    field: field({ required: true }),

    name: flags.string({
      required: false,
      description: "set the name of the field",
    }),
    displayName: flags.string({
      required: false,
      description: "set the display name of the field",
    }),
    required: flags.boolean({
      required: false,
      description: "set the field as required, or not",
      allowNo: true,
    }),
    searchable: flags.boolean({
      required: false,
      description: "set the field as searchable, or not",
      allowNo: true,
    }),
    description: flags.string({
      required: false,
      description: "set the description of the field",
    }),
  };

  async command() {
    const { flags } = this.parse(FieldsUpdate);
    cli.action.start(`Updating field ${chalk.green.bold(flags.field)} `);

    const data = await updateField(
      this.client,
      {
        name: flags.name,
        displayName: flags.displayName,
        required: flags.required,
        searchable: flags.searchable,
        description: flags.description,
      },
      {
        id: flags.field,
      }
    );

    cli.action.stop();
    this.output(data, flags, FIELD_COLUMNS);
  }
}
