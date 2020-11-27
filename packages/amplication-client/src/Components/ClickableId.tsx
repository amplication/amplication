import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { TruncatedId } from "./TruncatedId";
import "./ClickableId.scss";

type Props = LinkProps & {
  label?: string;
  id: string;
};

export const ClickableId = ({ to, id, label, onClick, ...rest }: Props) => {
  return (
    <span className="clickable-id">
      {label}{" "}
      <Link {...rest} to={to} onClick={onClick}>
        <TruncatedId id={id} />
      </Link>
    </span>
  );
};
