import {
  CircularProgress,
  EnumListStyle,
  EnumTextStyle,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import { ModuleListItem } from "./ModuleListItem";
import useModule from "./hooks/useModule";
import { useModulesContext } from "./modulesContext";

const ModuleList = React.memo(() => {
  const {
    findModulesData: data,
    findModulesLoading: loading,
    setSearchPhrase,
  } = useModule();

  const { searchPhrase } = useModulesContext();

  useEffect(() => {
    setSearchPhrase(searchPhrase);
  }, [searchPhrase, setSearchPhrase]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <List listStyle={EnumListStyle.Default}>
          {data?.modules?.length ? (
            data?.modules?.map((module) => (
              <ModuleListItem key={module.id} module={module} />
            ))
          ) : (
            <ListItem>
              <Text textStyle={EnumTextStyle.Description}>
                No modules found
              </Text>
            </ListItem>
          )}
        </List>
      )}
    </>
  );
});

export default ModuleList;
