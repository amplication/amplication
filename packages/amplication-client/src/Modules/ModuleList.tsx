import {
  CircularProgress,
  SearchField,
  Snackbar,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import "./ModuleList.scss";
import NewModule from "./NewModule";
import useModule from "./hooks/useModule";

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "module-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const ModuleList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { currentWorkspace, currentProject } = useContext(AppContext);

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );
    const history = useHistory();

    const {
      findModules,
      findModulesData: data,
      findModulesError: error,
      findModulesLoading: loading,
    } = useModule();

    useEffect(() => {
      findModules({
        variables: {
          where: {
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
    }, [resourceId, searchPhrase, findModules]);

    const errorMessage = formatError(error);

    const handleModuleChange = useCallback(
      (module: models.Module) => {
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${module.id}`;
        history.push(fieldUrl);
      },
      [history, resourceId, currentWorkspace, currentProject]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.Modules)) {
        const module = data.Modules[0];
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${module.id}`;
        history.push(fieldUrl);
      }
    }, [
      data,
      selectFirst,
      resourceId,
      history,
      currentWorkspace,
      currentProject,
    ]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.Modules.length}{" "}
          {pluralize(data?.Modules.length, "Module", "Modules")}
        </div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.Modules?.map((module) => (
            <div key={module.id} className={`${CLASS_NAME}__list__item`}>
              <InnerTabLink
                icon="modules"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${module.id}`}
              >
                <span>{module.displayName}</span>--
                <span>
                  {module.description === null
                    ? "undefined"
                    : module.description}
                </span>
              </InnerTabLink>
            </div>
          ))}
        </div>
        {data?.Modules && (
          <NewModule onModuleAdd={handleModuleChange} resourceId={resourceId} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
