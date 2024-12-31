import { TabContentTitle } from "@amplication/ui/design-system";

import { EnumCustomPropertyType } from "../models";
import CustomPropertyForm from "./CustomPropertyForm";
import CustomPropertyOptionList from "./CustomPropertyOptions/CustomPropertyOptionList";
import * as models from "../models";

type Props = {
  customProperty: models.CustomProperty;
  handleSubmit: (data: models.CustomProperty) => void;
  onOptionListChanged: () => void;
  disabled?: boolean;
};

const CustomPropertyFormAndOptions = ({
  customProperty,
  handleSubmit,
  onOptionListChanged,
  disabled,
}: Props) => {
  return (
    <>
      <CustomPropertyForm
        onSubmit={handleSubmit}
        defaultValues={customProperty}
        disabled={disabled}
      />
      {[
        EnumCustomPropertyType.Select,
        EnumCustomPropertyType.MultiSelect,
      ].includes(customProperty.type) && (
        <>
          <TabContentTitle title="Options" subTitle="Add or remove options" />
          <CustomPropertyOptionList
            customProperty={customProperty}
            onOptionDelete={onOptionListChanged}
            onOptionAdd={onOptionListChanged}
            disabled={disabled}
          />
        </>
      )}
    </>
  );
};

export default CustomPropertyFormAndOptions;
