import * as models from "../models";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";

type Props = {
  change: models.PendingChange;
  name: string;
  relativeUrl: string;
  linkToOrigin: boolean;
};

const PendingChangeContent = ({
  change,
  name,
  relativeUrl,
  linkToOrigin,
}: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const url = `/${currentWorkspace?.id}/${currentProject?.id}/${change.resource.id}/${relativeUrl}`;

  return linkToOrigin ? <Link to={url}>{name}</Link> : <span>{name}</span>;
};
export default PendingChangeContent;
