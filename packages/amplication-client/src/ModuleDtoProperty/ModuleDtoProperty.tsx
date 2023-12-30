import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import ModuleDtoPropertyForm from "./ModuleDtoPropertyForm";
import useModuleDtoProperty from "./hooks/useModuleDtoProperty";
import ModuleDtoPropertyPreview from "./ModuleDtoPropertyPreview";

type Props = {
  moduleDtoProperty: models.ModuleDtoProperty;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
};

const ModuleDtoProperty = ({ moduleDtoProperty, onPropertyDelete }: Props) => {
  const { addEntity } = useContext(AppContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  const propertyId = moduleDtoProperty.id;

  const { updateModuleDtoProperty, updateModuleDtoPropertyError } =
    useModuleDtoProperty();

  const handleSubmit = useCallback(
    (data) => {
      updateModuleDtoProperty({
        onCompleted: () => {
          addEntity(propertyId);
        },
        variables: {
          where: {
            id: propertyId,
          },
          data: {
            ...data,
          },
        },
      }).catch(console.error);
    },
    [updateModuleDtoProperty, addEntity, propertyId]
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
