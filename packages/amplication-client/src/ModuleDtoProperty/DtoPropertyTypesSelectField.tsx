import {
  EnumItemsAlign,
  FlexItem,
  SelectField,
  ToggleField,
} from "@amplication/ui/design-system";
import { useField } from "formik";
import ModuleDtoSelectField from "../Components/ModuleDtoSelectField";
import { EnumModuleDtoPropertyType } from "../models";
import { TYPE_OPTIONS } from "./DtoPropertyTypesField";
import "./DtoPropertyTypesSelectField.scss";

type Props = {
  name: string;
  label: string;
};

const CLASS_NAME = "dto-property-types-select-field";

const DtoPropertyTypesSelectField = ({ name, label }: Props) => {
  const [, meta] = useField(name);

  return (
    <div className={CLASS_NAME}>
      <FlexItem itemsAlign={EnumItemsAlign.Center}>
        <SelectField
          name={`${name}.type`}
          label={label}
          options={TYPE_OPTIONS}
        />

        {meta.value?.type === EnumModuleDtoPropertyType.Dto && (
          <ModuleDtoSelectField name={`${name}.dtoId`} label="DTO" />
        )}
        <ToggleField name={`${name}.isArray`} label="Array" />
      </FlexItem>
    </div>
  );
};

export default DtoPropertyTypesSelectField;
