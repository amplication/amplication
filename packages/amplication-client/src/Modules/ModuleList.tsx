import {
  CircularProgress,
  EnumListStyle,
  EnumTextStyle,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { ModuleListItem } from "./ModuleListItem";
import useModule from "./hooks/useModule";

const ModuleList = React.memo(() => {
  const { findModulesData: data, findModulesLoading: loading } = useModule();

  return (
    <>
      {loading && <CircularProgress centerToParent />}
      <List listStyle={EnumListStyle.Dark}>
        {data?.modules?.length ? (
          data?.modules?.map((module) => (
            <ModuleListItem key={module.id} module={module} />
          ))
        ) : (
          <ListItem>
            <Text textStyle={EnumTextStyle.Description}>No modules found</Text>
          </ListItem>
        )}
      </List>
    </>
  );
});

export default ModuleList;
