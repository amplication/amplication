import { CircularProgress } from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import * as models from "../models";
import ModuleDtoProperty from "./ModuleDtoProperty";

type Props = {
  moduleDtoId: string;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
};
const ModuleDtoPropertyList = React.memo(
  ({ moduleDtoId, onPropertyDelete }: Props) => {
    const {
      getModuleDto,
      getModuleDtoData: data,
      getModuleDtoLoading: loading,
    } = useModuleDto();

    useEffect(() => {
      if (!moduleDtoId) return;

      getModuleDto({
        variables: {
          moduleDtoId: moduleDtoId,
        },
      });
    }, [moduleDtoId, getModuleDto]);

    return (
      <>
        {loading && <CircularProgress centerToParent />}

        {data?.ModuleDto?.properties.map((property) => (
          <ModuleDtoProperty
            key={property.id}
            moduleDtoProperty={property}
            onPropertyDelete={onPropertyDelete}
          />
        ))}
      </>
    );
  }
);

export default ModuleDtoPropertyList;
