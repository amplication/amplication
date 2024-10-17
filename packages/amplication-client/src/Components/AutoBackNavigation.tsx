import React from "react";
import { useHistory } from "react-router-dom";
import { BackNavigation } from "./BackNavigation";
import "./BackNavigation.scss";

export const AutoBackNavigation = () => {
  const history = useHistory();

  const hasPreviousPage = window.history.length > 1;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    history.goBack();
  };

  if (!hasPreviousPage) {
    return null;
  }

  return <BackNavigation onClick={handleClick} label={"Back"} to={".."} />;
};
