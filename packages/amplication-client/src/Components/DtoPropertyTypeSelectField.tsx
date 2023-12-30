import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleDtoPropertyType } from "../models";
import * as models from "../models";

type Props = Omit<SelectFieldProps, "options">;

export const typeMapping: {
  [key in models.EnumModuleDtoPropertyType]: {
    label: string;
  };
} = {
  [EnumModuleDtoPropertyType.Boolean]: {
    label: "Boolean",
  },
  [EnumModuleDtoPropertyType.DateTime]: {
    label: "DateTime",
  },
  [EnumModuleDtoPropertyType.Float]: {
    label: "Float",
  },
  [EnumModuleDtoPropertyType.Integer]: {
    label: "Integer",
  },
  [EnumModuleDtoPropertyType.Json]: {
    label: "Json",
  },
  [EnumModuleDtoPropertyType.String]: {
    label: "String",
  },
  [EnumModuleDtoPropertyType.Dto]: {
    label: "Dto",
  },
  [EnumModuleDtoPropertyType.Enum]: {
    label: "Enum",
  },
  [EnumModuleDtoPropertyType.Null]: {
    label: "Null",
  },
  [EnumModuleDtoPropertyType.Undefined]: {
    label: "Undefined",
  },
};

const options = Object.values(EnumModuleDtoPropertyType).map((value) => ({
  label: typeMapping[value].label,
  value,
}));

const DtoPropertyTypeSelectField = ({ ...props }: Props) => {
  return <SelectField {...props} options={options} />;
};

export default DtoPropertyTypeSelectField;
