import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleDtoPropertyType } from "../models";

type Props = Omit<SelectFieldProps, "options">;

const restVerbsMapping = [
  {
    label: "Boolean",
    value: EnumModuleDtoPropertyType.Boolean,
  },
  {
    label: "DateTime",
    value: EnumModuleDtoPropertyType.DateTime,
  },

  {
    label: "Float",
    value: EnumModuleDtoPropertyType.Float,
  },
  {
    label: "Integer",
    value: EnumModuleDtoPropertyType.Int,
  },
  {
    label: "Json",
    value: EnumModuleDtoPropertyType.Json,
  },
  {
    label: "String",
    value: EnumModuleDtoPropertyType.String,
  },
];

const DtoPropertyTypeSelectField = ({ ...props }: Props) => {
  return <SelectField {...props} options={restVerbsMapping} />;
};

export default DtoPropertyTypeSelectField;
