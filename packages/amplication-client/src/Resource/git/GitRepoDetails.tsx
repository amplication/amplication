import React from "react";

type Props = {
  className?: string;
  gitRepositoryFullName: string;
};

const GitRepoDetails: React.FC<Props> = ({
  className,
  gitRepositoryFullName,
}) => {
  return <div className={className}>{gitRepositoryFullName}</div>;
};

export default GitRepoDetails;
