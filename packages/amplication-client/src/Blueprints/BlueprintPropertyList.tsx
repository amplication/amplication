import {
  Dialog,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  List,
  ListItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import CustomPropertyFormAndOptions from "../CustomProperties/CustomPropertyFormAndOptions";
import { DeleteCustomProperty } from "../CustomProperties/DeleteCustomProperty";
import useCustomProperties from "../CustomProperties/hooks/useCustomProperties";
import NewCustomProperty from "../CustomProperties/NewCustomProperty";
import * as models from "../models";
import { formatError } from "../util/error";

type Props = {
  blueprint: models.Blueprint;
  onPropertyUpdated?: (property: models.CustomProperty) => void;
};

const BlueprintPropertyList = React.memo(
  ({ blueprint, onPropertyUpdated }: Props) => {
    const { updateCustomProperty, updateCustomPropertyError: updateError } =
      useCustomProperties();

    const errorMessage = formatError(updateError);

    const [selectedProperty, setSelectedProperty] =
      React.useState<models.CustomProperty | null>(null);

    const handleSubmit = (property: models.CustomProperty) => {
      const variables: models.MutationUpdateCustomPropertyArgs = {
        data: property,
        where: {
          id: selectedProperty.id,
        },
      };

      updateCustomProperty({
        variables,
      })
        .catch(console.error)
        .then((data) => {
          onPropertyUpdated &&
            onPropertyUpdated(data && data.data.updateCustomProperty);
        });
    };

    useEffect(() => {
      setSelectedProperty((prev) => {
        if (!prev) {
          return null;
        }
        return blueprint?.properties?.find(
          (property) => property.id === prev.id
        );
      });
    }, [blueprint?.properties]);

    return (
      <>
        <Dialog
          isOpen={!!selectedProperty}
          onDismiss={() => setSelectedProperty(null)}
          title={selectedProperty?.name}
        >
          {!!selectedProperty && (
            <CustomPropertyFormAndOptions
              handleSubmit={handleSubmit}
              customProperty={selectedProperty}
              onOptionListChanged={() => {
                onPropertyUpdated(selectedProperty);
              }}
            ></CustomPropertyFormAndOptions>
          )}
        </Dialog>
        <TabContentTitle
          title="Properties"
          subTitle="Properties can be used to store additional information about the instances of the blueprint"
        />
        <NewCustomProperty
          blueprintId={blueprint.id}
          onCustomPropertyAdd={onPropertyUpdated}
        />
        <List>
          {(!blueprint?.properties || blueprint?.properties?.length === 0) && (
            <ListItem>No Properties defined</ListItem>
          )}

          {blueprint?.properties?.map((property, index) => (
            <ListItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
              end={
                <DeleteCustomProperty
                  customProperty={property}
                  onDelete={() => {
                    onPropertyUpdated && onPropertyUpdated(null);
                  }}
                />
              }
              key={property.key}
              onClick={() => setSelectedProperty(property)}
            >
              <Text textStyle={EnumTextStyle.Normal}>{property.name}</Text>
              <Text textStyle={EnumTextStyle.Description}>{property.key}</Text>
            </ListItem>
          ))}
        </List>

        <Snackbar open={Boolean(updateError)} message={errorMessage} />
      </>
    );
  }
);

export default BlueprintPropertyList;
