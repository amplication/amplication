import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleActionRestVerb } from "../models";

type Props = Omit<SelectFieldProps, "options">;

const restVerbsMapping = [
  {
    label: "get",
    value: EnumModuleActionRestVerb.Get,
  },
  {
    label: "delete",
    value: EnumModuleActionRestVerb.Delete,
  },
  {
    label: "head",
    value: EnumModuleActionRestVerb.Head,
  },
  {
    label: "options",
    value: EnumModuleActionRestVerb.Options,
  },
  {
    label: "patch",
    value: EnumModuleActionRestVerb.Patch,
  },
  {
    label: "post",
    value: EnumModuleActionRestVerb.Post,
  },
  {
    label: "put",
    value: EnumModuleActionRestVerb.Put,
  },
  {
    label: "trace",
    value: EnumModuleActionRestVerb.Trace,
  },
];

const RestVerbSelectField = ({ ...props }: Props) => {
  return <SelectField {...props} options={restVerbsMapping} />;
};

export default RestVerbSelectField;
