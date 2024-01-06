import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import ModuleDtoPropertyForm from "./ModuleDtoPropertyForm";
import useModuleDtoProperty from "./hooks/useModuleDtoProperty";
import ModuleDtoPropertyPreview from "./ModuleDtoPropertyPreview";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";

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
        onCompleted: () => {
          addEntity(propertyId);
          setOriginalName(data.name);
          onPropertyChanged && onPropertyChanged(moduleDtoProperty);
        },
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
      {!editMode ? (
        <ModuleDtoPropertyPreview
          dtoProperty={moduleDtoProperty}
          onEdit={() => {
            setEditMode(true);
          }}
        />
      ) : (
        <ModuleDtoPropertyForm
          isCustomDto={isCustomDto}
          onSubmit={handleSubmit}
          defaultValues={moduleDtoProperty}
          onPropertyDelete={onPropertyDelete}
          onPropertyClose={() => {
            setEditMode(false);
          }}
        />
      )}

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDtoProperty;
