import {
  CircularProgress,
  EnumTextStyle,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect } from "react";
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
      getModuleDtoRefetch: refetch,
    } = useModuleDto();

    useEffect(() => {
      if (!moduleDtoId) return;

      getModuleDto({
        variables: {
          moduleDtoId: moduleDtoId,
        },
      });
    }, [moduleDtoId, getModuleDto]);

    const onDtoPropertyChanged = useCallback(() => {
      refetch();
    }, [refetch]);

    return (
      <>
        {loading && <CircularProgress centerToParent />}

        <List
          headerContent={<Text textStyle={EnumTextStyle.Tag}>Properties</Text>}
        >
          {data?.moduleDto?.properties.map((property, index) => (
            <ListItem key={index}>
              <ModuleDtoProperty
                moduleDto={data.moduleDto}
                moduleDtoProperty={property}
                onPropertyChanged={onDtoPropertyChanged}
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
