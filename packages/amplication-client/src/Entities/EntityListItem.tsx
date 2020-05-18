import React, { useState, useCallback } from "react";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { IconButton } from "@rmwc/icon-button";
import "@rmwc/icon-button/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./EntityListItem.css";

type Props = {
  entity: {
    name: string;
  };
};

const EntityListItem = ({ entity }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const shrink = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  const expand = useCallback(() => {
    setExpanded(true);
  }, [setExpanded]);

  return (
    <Card className="entity-list-item">
      <header onClick={expanded ? shrink : expand}>
        <h2>{entity.name}</h2>
        <IconButton icon={expanded ? "expand_less" : "expand_more"} />
      </header>
      {expanded && (
        <div className="actions">
          <Button outlined icon="filter_3">
            Field Name
          </Button>
          <Button outlined icon="insert_photo">
            Field Name
          </Button>
          <Button outlined icon="link">
            Field Name
          </Button>
          <Button outlined icon="format_size">
            Field Name
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EntityListItem;
