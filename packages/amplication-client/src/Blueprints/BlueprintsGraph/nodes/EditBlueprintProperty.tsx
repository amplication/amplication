import {
  Dialog,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { Snackbar } from "@mui/material";
import React from "react";
import CustomPropertyFormAndOptions from "../../../CustomProperties/CustomPropertyFormAndOptions";
import { CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON } from "../../../CustomProperties/CustomPropertyList";
import useCustomProperties from "../../../CustomProperties/hooks/useCustomProperties";
import * as models from "../../../models";
import { formatError } from "../../../util/error";
import useBlueprints from "../../hooks/useBlueprints";

type Props = {
  blueprint: models.Blueprint;
  property: models.CustomProperty;
};

const EditBlueprintProperty = React.memo(({ blueprint, property }: Props) => {
  const { updateCustomProperty, updateCustomPropertyError: updateError } =
    useCustomProperties();

  const { getBlueprintRefetch } = useBlueprints(blueprint.id);

  const errorMessage = formatError(updateError);

  const handleSubmit = (data: models.CustomProperty) => {
    const variables: models.MutationUpdateCustomPropertyArgs = {
      data: data,
      where: {
        id: property.id,
      },
    };

    updateCustomProperty({
      variables,
    }).catch(console.error);
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title={property?.name}
      >
        {isOpen && (
          <CustomPropertyFormAndOptions
            handleSubmit={handleSubmit}
            customProperty={property}
            onOptionListChanged={getBlueprintRefetch}
          ></CustomPropertyFormAndOptions>
        )}
      </Dialog>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="blueprint-node__child-item"
      >
        <Text
          textStyle={EnumTextStyle.Description}
          textColor={EnumTextColor.White}
        >
          <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
            <Icon
              size="xsmall"
              icon={CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[property.type].icon}
              color={EnumTextColor.Black20}
            />
            {property.name}
          </FlexItem>
        </Text>
      </div>
      <Snackbar open={Boolean(updateError)} message={errorMessage} />
    </>
  );
});

export default EditBlueprintProperty;
