import {
  Button,
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  Icon,
} from "@amplication/ui/design-system";
import { FieldArray, FieldArrayRenderProps, getIn } from "formik";
import { get } from "lodash";
import { useCallback, useMemo } from "react";
import * as models from "../models";
import { EnumModuleDtoPropertyType } from "../models";
import DtoPropertyTypesSelectField from "./DtoPropertyTypesSelectField";

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

export const TYPE_OPTIONS = Object.values(EnumModuleDtoPropertyType).map(
  (value) => ({
    label: typeMapping[value].label,
    value,
  })
);

type Props = {
  name: string;
};

const DtoPropertyTypesField = ({ name }: Props) => {
  return (
    <FieldArray name={name} render={(props) => <PropertyTypes {...props} />} />
  );
};

const PropertyTypes = ({
  form,
  name,
  remove,
  replace,
  push,
}: FieldArrayRenderProps) => {
  const propertyTypes = get(form.values, name) || [];

  const errors = useMemo(() => {
    const error = getIn(form.errors, name);
    if (typeof error === "string") return error;
    return null;
  }, [form.errors, name]);

  return (
    <div>
      {errors && <div>{errors}</div>}
      {propertyTypes?.length
        ? propertyTypes.map((type: models.PropertyTypeDef, index: number) => (
            <PropertyType
              key={index}
              index={index}
              onRemove={remove}
              name={name}
              value={type}
            />
          ))
        : ""}
      <Button
        onClick={() =>
          push({ type: EnumModuleDtoPropertyType.String, isArray: false })
        }
        buttonStyle={EnumButtonStyle.Text}
      >
        <Icon icon="plus" />
        Add union type
      </Button>
    </div>
  );
};

type PropertyTypeProps = {
  name: string;
  index: number;
  onRemove: (index: number) => void;
  value?: models.PropertyTypeDef;
};

const PropertyType = ({ name, index, onRemove, value }: PropertyTypeProps) => {
  const handleRemoveOption = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <FlexItem itemsAlign={EnumItemsAlign.Center}>
      <DtoPropertyTypesSelectField name={`${name}.${index}`} label="Type" />
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.Text}
        icon="trash_2"
        onClick={handleRemoveOption}
      />
    </FlexItem>
  );
};

export default DtoPropertyTypesField;
