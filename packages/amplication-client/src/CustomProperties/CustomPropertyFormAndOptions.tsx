import { TabContentTitle } from "@amplication/ui/design-system";

import { EnumCustomPropertyType } from "../models";
import CustomPropertyForm from "./CustomPropertyForm";
import CustomPropertyOptionList from "./CustomPropertyOptions/CustomPropertyOptionList";
import * as models from "../models";

type Props = {
  customProperty: models.CustomProperty;
  handleSubmit: (data: models.CustomProperty) => void;
  onOptionListChanged: () => void;
};

const CustomPropertyFormAndOptions = ({
  customProperty,
  handleSubmit,
  onOptionListChanged,
}: Props) => {
  return (
    <>
      <CustomPropertyForm
        onSubmit={handleSubmit}
        defaultValues={customProperty}
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
          />
        </>
      )}
    </>
  );
};

export default CustomPropertyFormAndOptions;
