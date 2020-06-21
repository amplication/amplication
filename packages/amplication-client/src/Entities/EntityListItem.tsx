import React, { useCallback } from "react";
import { Switch, Route } from "react-router-dom";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { List } from "@rmwc/list";
import "@rmwc/list/styles";
import * as types from "./types";
import EntityFieldListitem from "./EntityFieldListItem";
import MiniNewEntityField from "./MiniNewEntityField";
import "./EntityListItem.scss";

type Props = {
  entity: types.Entity;
  onAddField: (entity: types.Entity) => void;
  onActivate: (entity: types.Entity) => void;
  onActivateField: (entity: types.Entity, field: types.EntityField) => void;
};

const EntityListItem = ({
  entity,
  onAddField,
  onActivate,
  onActivateField,
}: Props) => {
  const handleClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onActivate(entity);
      }
    },
    [onActivate, entity]
  );

  const handleFieldClick = useCallback(
    (field) => {
      onActivateField(entity, field);
    },
    [onActivateField, entity]
  );

  const handleAddField = useCallback(
    (event) => {
      onAddField(entity);
    },
    [onAddField, entity]
  );

  return (
    <>
      <Card className="entity-list-item" onClick={handleClick}>
        <div className="header">
          <h2 onClick={handleClick}>{entity.name}</h2>
        </div>
        <List>
          {entity.fields.map((field) => (
            <EntityFieldListitem
              entity={entity}
              field={field}
              onClick={handleFieldClick}
            />
          ))}
        </List>
        <Switch>
          <Route
            path={`/:application/entities/${entity.id}/fields/new`}
            component={MiniNewEntityField}
          />
          <Route path="/:application/entities">
            <Button icon="add" onClick={handleAddField}>
              Add Field
            </Button>
          </Route>
        </Switch>
      </Card>
    </>
  );
};

export default EntityListItem;
