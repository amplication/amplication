import { HorizontalRule, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import ModuleDtoPropertyForm from "./ModuleDtoPropertyForm";
import useModuleDtoProperty from "./hooks/useModuleDtoProperty";

type Props = {
  moduleDtoProperty: models.ModuleDtoProperty;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
};

const ModuleDtoProperty = ({ moduleDtoProperty, onPropertyDelete }: Props) => {
  const { addEntity } = useContext(AppContext);

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
      <ModuleDtoPropertyForm
        isCustomDto={isCustomDto}
        onSubmit={handleSubmit}
        defaultValues={moduleDtoProperty}
        onPropertyDelete={onPropertyDelete}
      />
      <HorizontalRule />

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDtoProperty;
