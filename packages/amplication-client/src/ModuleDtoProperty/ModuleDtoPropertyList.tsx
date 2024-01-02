import {
  CircularProgress,
  EnumTextStyle,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
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

        <List
          headerContent={<Text textStyle={EnumTextStyle.Tag}>Properties</Text>}
        >
          {data?.moduleDto?.properties.map((property) => (
            <ListItem key={property.id}>
              <ModuleDtoProperty
                moduleDtoProperty={property}
                onPropertyDelete={onPropertyDelete}
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  }
);

export default ModuleDtoPropertyList;
