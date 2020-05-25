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
import { EntityFieldDataType } from "./fields";
import "./EntityListItem.css";
import { formatError } from "../errorUtil";

type Entity = {
  id: string;
  name: string;
  fields: Array<{
    id: string;
    name: string;
    dataType: EntityFieldDataType;
  }>;
};

type Props = {
  entity: Entity;
  onAddField: (entity: Entity) => void;
  onRemove: () => void;
};

const FIELD_DATA_TYPE_TO_ICON: { [key in EntityFieldDataType]: string } = {
  [EntityFieldDataType.singleLineText]: "filter_3",
  [EntityFieldDataType.multiLineText]: "filter_3",
  [EntityFieldDataType.email]: "filter_3",
  [EntityFieldDataType.numbers]: "filter_3",
  [EntityFieldDataType.autoNumber]: "filter_3",
};

const EntityListItem = ({ entity, onAddField }: Props) => {
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
                <Button
                  key={field.id}
                  outlined
                  icon={FIELD_DATA_TYPE_TO_ICON[field.dataType]}
                >
                  {field.name}
                </Button>
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
