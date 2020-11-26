import React from "react";
import { Link } from "react-router-dom";
import { TruncatedId } from "./TruncatedId";
import "./ClickableId.scss";

type Props = {
  to: string;
  label: string;
  id: string;
};

export const ClickableId = ({ to, id, label }: Props) => {
  return (
    <span className="clickable-id">
      {label}{" "}
      <Link to={to}>
        <TruncatedId id={id} />
      </Link>
    </span>
  );
};
