import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleActionRestVerb } from "../models";

type Props = Omit<SelectFieldProps, "options">;

type restVerbsDic = {
  key: string;
  verb: EnumModuleActionRestVerb;
};

const restVerbsMapping: restVerbsDic[] = [
  {
    key: "get",
    verb: EnumModuleActionRestVerb.Get,
  },
  {
    key: "delete",
    verb: EnumModuleActionRestVerb.Delete,
  },
  {
    key: "head",
    verb: EnumModuleActionRestVerb.Head,
  },
  {
    key: "options",
    verb: EnumModuleActionRestVerb.Options,
  },
  {
    key: "patch",
    verb: EnumModuleActionRestVerb.Patch,
  },
  {
    key: "post",
    verb: EnumModuleActionRestVerb.Post,
  },
  {
    key: "put",
    verb: EnumModuleActionRestVerb.Put,
  },
  {
    key: "trace",
    verb: EnumModuleActionRestVerb.Trace,
  },
];

const RestVerbSelectField = ({ ...props }: Props) => {
  const res = restVerbsMapping.map((verb) => ({
    value: verb.verb,
    label: verb.key,
  }));

  return <SelectField {...props} options={res} />;
};

export default RestVerbSelectField;
