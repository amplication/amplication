import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";

type Props = {
  className?: string;
};

const GitRepoDetails: React.FC<Props> = ({ className }) => {
  const { gitRepositoryFullName } = useContext(AppContext);
  return <div className={className}>{gitRepositoryFullName}</div>;
};

export default GitRepoDetails;
