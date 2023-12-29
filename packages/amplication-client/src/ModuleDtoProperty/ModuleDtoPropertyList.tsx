import {
  CircularProgress,
  EnumListStyle,
  List,
} from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { ModuleDtoPropertyListItem } from "./ModuleDtoPropertyListItem";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleDtoId: string;
  moduleId: string;
};
const ModuleDtoPropertyList = React.memo(({ moduleDtoId, moduleId }: Props) => {
  const {
    getModuleDto,
    getModuleDtoData: data,
    getModuleDtoError: errorLoading,
    getModuleDtoLoading: loading,
  } = useModuleDto();

  useEffect(() => {
    getModuleDto({
      variables: {
        moduleDtoId: moduleDtoId,
      },
    });
  }, [moduleDtoId, getModuleDto]);

  return (
    <>
      {loading && <CircularProgress centerToParent />}
      <List listStyle={EnumListStyle.Dark} collapsible>
        {data?.ModuleDto?.properties.map((property) => (
          <ModuleDtoPropertyListItem
            key={property.id}
            moduleId={moduleId}
            moduleDtoId={moduleDtoId}
            moduleDtoProperty={property}
          />
        ))}
      </List>
    </>
  );
});

export default ModuleDtoPropertyList;
