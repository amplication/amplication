import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import "./ClickableId.scss";

type Props = {
  to: string;
  label: string;
  id: string;
};

const TRUNCATED_ID_LENGTH = 8;

export const ClickableId = ({ to, id, label }: Props) => {
  const truncatedId = useMemo(() => {
    return id.slice(id.length - TRUNCATED_ID_LENGTH);
  }, [id]);

  return (
    <span className="clickable-id">
      {label} <Link to={to}>{truncatedId}</Link>
    </span>
  );
};
