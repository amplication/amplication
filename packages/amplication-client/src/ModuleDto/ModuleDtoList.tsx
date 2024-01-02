import {
  CircularProgress,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect } from "react";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { ModuleDtoListItem } from "./ModuleDtoListItem";
import NewModuleDto from "./NewModuleDto";
import useModuleDto from "./hooks/useModuleDto";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
};
const ModuleDtoList = React.memo(({ moduleId, resourceId }: Props) => {
  const {
    findModuleDtos,
    findModuleDtosData: data,
    findModuleDtosLoading: loading,
    findModuleDtoRefetch: refetch,
  } = useModuleDto();

  const { getModuleData: moduleData } = useModule(moduleId);

  useEffect(() => {
    findModuleDtos({
      variables: {
        where: {
          parentBlock: { id: moduleId },
          resource: { id: resourceId },
        },
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
      },
    });
  }, [moduleId, findModuleDtos, resourceId]);

  const onDtoCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      {loading && <CircularProgress centerToParent />}
      <List
        listStyle={EnumListStyle.Transparent}
        collapsible
        headerContent={
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            end={
              <NewModuleDto
                moduleId={moduleId}
                resourceId={resourceId}
                onDtoCreated={onDtoCreated}
              />
            }
          >
            <Text
              textStyle={EnumTextStyle.Normal}
              textColor={EnumTextColor.White}
              textWeight={EnumTextWeight.Bold}
            >
              DTOs
            </Text>
          </FlexItem>
        }
      >
        {data?.moduleDtos?.length ? (
          data?.moduleDtos?.map((dto) => (
            <ModuleDtoListItem
              key={dto.id}
              module={moduleData?.module}
              moduleDto={dto}
            />
          ))
        ) : (
          <ListItem>
            <Text textStyle={EnumTextStyle.Description}>No DTOs found</Text>
          </ListItem>
        )}
      </List>
    </>
  );
});

export default ModuleDtoList;
