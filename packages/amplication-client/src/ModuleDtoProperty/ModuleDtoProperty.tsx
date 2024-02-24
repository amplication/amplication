import {
  Button,
  EnumButtonStyle,
  EnumGapSize,
  FlexItem,
  ListItem,
  Snackbar,
  EnumFlexDirection,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { DeleteModuleDtoProperty } from "./DeleteModuleDtoProperty";
import ModuleDtoPropertyForm from "./ModuleDtoPropertyForm";
import ModuleDtoPropertyPreview from "./ModuleDtoPropertyPreview";

type Props = {
  moduleDto: models.ModuleDto;
  moduleDtoProperty: models.ModuleDtoProperty;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
  onPropertyChanged?: (property: models.ModuleDtoProperty) => void;
};

const ModuleDtoProperty = ({
  moduleDto,
  moduleDtoProperty,
  onPropertyDelete,
  onPropertyChanged,
}: Props) => {
  const { addEntity } = useContext(AppContext);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>(
    moduleDtoProperty.name
  );

  const propertyId = moduleDtoProperty.name;

  const { updateModuleDtoProperty, updateModuleDtoPropertyError } =
    useModuleDto();

  const handleSubmit = useCallback(
    (data) => {
      updateModuleDtoProperty({
        variables: {
          where: {
            propertyName: originalName,
            moduleDto: {
              id: moduleDto.id,
            },
          },
          data: {
            ...data,
          },
        },
        onCompleted: () => {
          addEntity(propertyId);
          setOriginalName(data.name);
          onPropertyChanged && onPropertyChanged(moduleDtoProperty);
        },
      }).catch(console.error);
    },
    [
      updateModuleDtoProperty,
      addEntity,
      propertyId,
      originalName,
      moduleDto,
      onPropertyChanged,
      moduleDtoProperty,
      setOriginalName,
    ]
  );

  const hasError = Boolean(updateModuleDtoPropertyError);

  const errorMessage = formatError(updateModuleDtoPropertyError);

  const isCustomDto = true;

  return (
    <>
      <ListItem
        onClick={() => {
          setEditMode(!editMode);
        }}
      >
        <FlexItem gap={EnumGapSize.Small}>
          <ModuleDtoPropertyPreview dtoProperty={moduleDtoProperty} />
          <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
            <DeleteModuleDtoProperty
              moduleDto={moduleDto}
              moduleDtoProperty={moduleDtoProperty}
              onPropertyDelete={onPropertyDelete}
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={() => {
                setEditMode(!editMode);
              }}
              icon="edit"
            />
          </FlexItem.FlexEnd>
        </FlexItem>
      </ListItem>
      {editMode && (
        <>
          <ListItem>
            <ModuleDtoPropertyForm
              moduleDto={moduleDto}
              isCustomDto={isCustomDto}
              onSubmit={handleSubmit}
              defaultValues={moduleDtoProperty}
              onPropertyDelete={onPropertyDelete}
              onPropertyClose={() => {
                setEditMode(false);
              }}
            />
          </ListItem>
        </>
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDtoProperty;
