import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  FlexItem,
  ListItem,
  Snackbar,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import * as models from "../../models";
import { formatError } from "../../util/error";
import useCustomProperties from "../hooks/useCustomProperties";
import CustomPropertyOptionForm from "./CustomPropertyOptionForm";
import { DeleteCustomPropertyOption } from "./DeleteCustomPropertyOption";

type Props = {
  customProperty: models.CustomProperty;
  customPropertyOption: models.CustomPropertyOption;
  onOptionDelete?: (option: models.CustomPropertyOption) => void;
  onOptionChanged?: (option: models.CustomPropertyOption) => void;
  disabled?: boolean;
};

const CustomPropertyOption = ({
  customProperty,
  customPropertyOption,
  onOptionDelete,
  onOptionChanged,
  disabled,
}: Props) => {
  const [originalValue, setOriginalValue] = useState<string>(
    customPropertyOption.value
  );

  const { updateCustomPropertyOption, updateCustomPropertyOptionError } =
    useCustomProperties();

  const handleSubmit = useCallback(
    (data) => {
      updateCustomPropertyOption({
        variables: {
          where: {
            value: originalValue,
            customProperty: {
              id: customProperty.id,
            },
          },
          data: {
            ...data,
          },
        },
        onCompleted: () => {
          setOriginalValue(data.value);
          onOptionChanged && onOptionChanged(customPropertyOption);
        },
      }).catch(console.error);
    },
    [
      updateCustomPropertyOption,
      originalValue,
      customProperty,
      onOptionChanged,
      customPropertyOption,
      setOriginalValue,
    ]
  );

  const hasError = Boolean(updateCustomPropertyOptionError);

  const errorMessage = formatError(updateCustomPropertyOptionError);

  return (
    <>
      <ListItem>
        <FlexItem gap={EnumGapSize.Small}>
          <CustomPropertyOptionForm
            onSubmit={handleSubmit}
            defaultValues={customPropertyOption}
            disabled={disabled}
          />
          <FlexItem.FlexEnd
            direction={EnumFlexDirection.Row}
            alignSelf={EnumContentAlign.Center}
          >
            <DeleteCustomPropertyOption
              customProperty={customProperty}
              customPropertyOption={customPropertyOption}
              onOptionDelete={onOptionDelete}
              disabled={disabled}
            />
          </FlexItem.FlexEnd>
        </FlexItem>
      </ListItem>

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default CustomPropertyOption;
