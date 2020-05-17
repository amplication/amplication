import React, { useState, useCallback } from "react";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { IconButton } from "@rmwc/icon-button";
import "@rmwc/icon-button/styles";
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
      <header>
        <h2>{entity.name}</h2>
        <IconButton
          icon={expanded ? "expand_less" : "expand_more"}
          onClick={expanded ? shrink : expand}
        />
      </header>
      {expanded && "More content"}
    </Card>
  );
};

export default EntityListItem;
