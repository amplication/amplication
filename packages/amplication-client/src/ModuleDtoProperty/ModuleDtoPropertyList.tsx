import { List } from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import * as models from "../models";
import ModuleDtoProperty from "./ModuleDtoProperty";
import NewModuleDtoProperty from "./NewModuleDtoProperty";

type Props = {
  moduleDto: models.ModuleDto;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
  onPropertyAdd?: (property: models.ModuleDto) => void;
};
const ModuleDtoPropertyList = React.memo(
  ({ moduleDto, onPropertyDelete, onPropertyAdd }: Props) => {
    const onDtoPropertyChanged = useCallback(() => {
      onPropertyAdd && onPropertyAdd(moduleDto);
    }, [moduleDto, onPropertyAdd]);

    return (
      <>
        <List
          headerContent={
            <NewModuleDtoProperty
              moduleDto={moduleDto}
              onPropertyAdd={onPropertyAdd}
            />
          }
        >
          {moduleDto?.properties?.map((property, index) => (
            <ModuleDtoProperty
              key={index}
              moduleDto={moduleDto}
              moduleDtoProperty={property}
              onPropertyChanged={onDtoPropertyChanged}
              onPropertyDelete={onPropertyDelete}
            />
          ))}
        </List>
      </>
    );
  }
);

export default ModuleDtoPropertyList;
