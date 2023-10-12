import {
  CircularProgress,
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  List,
  SearchField,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";
import * as models from "../models";
import { formatError } from "../util/error";

import { pluralize } from "../util/pluralize";
import { ModuleActionListItem } from "./ModuleActionListItem";
import useModuleAction from "./hooks/useModuleAction";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";

const DATE_CREATED_FIELD = "createdAt";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module: string;
  }>;
};
const ModuleActionList = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const {
    findModuleActions,
    findModuleActionsData: data,
    findModuleActionsError: errorLoading,
    findModuleActionsLoading: loading,
  } = useModuleAction();

  useEffect(() => {
    findModuleActions({
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
  }, [moduleId, searchPhrase, findModuleActions]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <>
      <TabContentTitle
        title="Module Actions"
        subTitle="Actions are used to perform operations on resources, with or without API endpoints."
      />
      <SearchField
        label="search"
        placeholder="Search"
        onChange={handleSearchChange}
      />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.ModuleActions?.length}{" "}
          {pluralize(data?.ModuleActions?.length, "Action", "Actions")}
        </Text>
      </FlexItem>
      {loading && <CircularProgress centerToParent />}
      <List>
        {data?.ModuleActions?.map((action) => (
          <ModuleActionListItem
            key={action.id}
            moduleId={moduleId}
            moduleAction={action}
            onError={setError}
          />
        ))}
      </List>
      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
});

export default ModuleActionList;
