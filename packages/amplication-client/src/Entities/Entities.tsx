import React, { useCallback } from "react";
import {
  match,
  Link,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IconButton } from "@rmwc/icon-button";
import "@rmwc/icon-button/styles";
import { Fab } from "@rmwc/fab";
import "@rmwc/fab/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import Sidebar from "./Sidebar";
import NewEntity from "./NewEntity";
import EntityListItem from "./EntityListItem";
import "./Entities.css";
import { formatError } from "../errorUtil";
import NewEntityField from "./NewEntityField";
import { EntityFieldDataType } from "./fields";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  app: {
    entities: Array<{
      id: string;
      name: string;
      fields: Array<{
        id: string;
        name: string;
        dataType: EntityFieldDataType;
      }>;
    }>;
  };
};

function Entities({ match }: Props) {
  const { application } = match.params;
  const history = useHistory();
  const { data, loading, error, refetch } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: application,
    },
  });

  const addField = useCallback((entity) => {
    const params = new URLSearchParams({ "entity-name": entity.name });
    history.push(`/${application}/entities/${entity.id}/fields/new?${params}`);
  }, []);

  const removeField = useCallback((entity) => {
    /** @todo */
    console.log("Delete", entity);
  }, []);

  const subpathMatch = useRouteMatch<{ part: string }>(
    "/:application/entities/:part"
  );
  const sideBarOpen = Boolean(subpathMatch?.params.part);

  if (loading) {
    return <span>Loading...</span>;
  }

  const errorMessage = formatError(error);

  return (
    <>
      <main className="entities">
        <header>
          <h1>Entities</h1>
          <section className="actions">
            <IconButton icon="view_list" />
            <IconButton icon="filter_list" />
            <Link to="new">
              <Fab icon="add" />
            </Link>
          </section>
        </header>
        {data?.app.entities.map((entity) => (
          <EntityListItem
            key={entity.id}
            entity={entity}
            onAddField={addField}
            onRemoveField={removeField}
          />
        ))}
        <Sidebar open={sideBarOpen}>
          <Switch>
            <Route exact path="/:application/entities/new">
              <NewEntity application={application} onCreate={refetch} />
            </Route>
            <Route exact path="/:application/entities/:entity/fields/new">
              <NewEntityField onCreate={refetch} />
            </Route>
          </Switch>
        </Sidebar>
      </main>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default Entities;

const GET_ENTITIES = gql`
  query getEntities($id: String!) {
    app(where: { id: $id }) {
      id
      entities {
        id
        name
        fields {
          id
          name
          dataType
        }
      }
    }
  }
`;
