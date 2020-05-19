import React, { useState, useCallback } from "react";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { IconButton } from "@rmwc/icon-button";
import "@rmwc/icon-button/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { EntityFieldDataType } from "./fields";
import "./EntityListItem.css";

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
  onRemoveField: (entity: Entity) => void;
};

const FIELD_DATA_TYPE_TO_ICON: { [key in EntityFieldDataType]: string } = {
  [EntityFieldDataType.singleLineText]: "filter_3",
  [EntityFieldDataType.multiLineText]: "filter_3",
  [EntityFieldDataType.email]: "filter_3",
  [EntityFieldDataType.numbers]: "filter_3",
  [EntityFieldDataType.autoNumber]: "filter_3",
};

const EntityListItem = ({ entity, onAddField, onRemoveField }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const shrink = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  const expand = useCallback(() => {
    setExpanded(true);
  }, [setExpanded]);

  const handleAddField = useCallback(() => {
    onAddField(entity);
  }, []);

  const handleRemove = useCallback(() => {
    onRemoveField(entity);
  }, []);

  return (
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
            <Button icon="clear" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default EntityListItem;
