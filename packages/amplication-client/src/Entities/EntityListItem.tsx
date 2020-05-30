import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { IconButton } from "@rmwc/icon-button";
import "@rmwc/icon-button/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import "./EntityListItem.css";
import * as types from "./types";
import EntityFieldListitem from "./EntityFieldListItem";
import { formatError } from "../errorUtil";

type Props = {
  entity: types.Entity;
  onAddField: (entity: types.Entity) => void;
  onRemove: () => void;
  onActivateField: (entity: types.Entity, field: types.EntityField) => void;
};

const EntityListItem = ({ entity, onAddField, onActivateField }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const [
    deleteEntity,
    { loading: loadingDelete, error: deleteError },
  ] = useMutation(DELETE_ENTITY);

  const shrink = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  const expand = useCallback(() => {
    setExpanded(true);
  }, [setExpanded]);

  const handleAddField = useCallback(() => {
    onAddField(entity);
  }, [onAddField, entity]);

  const handleRemove = useCallback(() => {
    deleteEntity({
      variables: {
        id: entity.id,
      },
    });
  }, [deleteEntity, entity]);

  const handleFieldClick = useCallback(
    (field) => {
      onActivateField(entity, field);
    },
    [onActivateField, entity]
  );

  return (
    <>
      <Card className="entity-list-item">
        <header onClick={expanded ? shrink : expand}>
          <h2>{entity.name}</h2>
          <IconButton icon={expanded ? "expand_less" : "expand_more"} />
        </header>
        {expanded && (
          <>
            <div className="fields">
              {entity.fields.map((field) => (
                <EntityFieldListitem field={field} onClick={handleFieldClick} />
              ))}
            </div>
            <div className="actions">
              <Button icon="add" onClick={handleAddField}>
                Add Field
              </Button>
              <Button
                icon="clear"
                onClick={handleRemove}
                disabled={loadingDelete}
              >
                Remove
              </Button>
            </div>
          </>
        )}
      </Card>
      <Snackbar
        open={Boolean(deleteError)}
        message={formatError(deleteError)}
      />
    </>
  );
};

export default EntityListItem;

const DELETE_ENTITY = gql`
  mutation deleteEntity($id: String!) {
    deleteOneEntity(where: { id: $id }) {
      id
    }
  }
`;
