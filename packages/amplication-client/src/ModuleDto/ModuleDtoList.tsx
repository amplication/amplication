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
import React, { useEffect } from "react";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { ModuleDtoListItem } from "./ModuleDtoListItem";
import useModuleDto from "./hooks/useModuleDto";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
  searchPhrase?: string;
  disabled?: boolean;
};
const ModuleDtoList = React.memo(
  ({ moduleId, resourceId, searchPhrase, disabled }: Props) => {
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
            displayName:
              searchPhrase !== ""
                ? {
                    contains: searchPhrase,
                    mode: models.QueryMode.Insensitive,
                  }
                : undefined,
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });
    }, [moduleId, findModuleDtos, resourceId, searchPhrase]);

    return (
      <>
        <List listStyle={EnumListStyle.Default}>
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
              {loading ? (
                <CircularProgress centerToParent />
              ) : (
                <Text textStyle={EnumTextStyle.Description}>No DTOs found</Text>
              )}
            </ListItem>
          )}
        </List>
      </>
    );
  }
);

export default ModuleDtoList;
