import React, { useMemo } from "react";

type Props = {
  id: string;
};

const TRUNCATED_ID_LENGTH = 8;

export const TruncatedId = ({ id }: Props) => {
  const truncatedId = useMemo(() => {
    return id.slice(id.length - TRUNCATED_ID_LENGTH);
  }, [id]);

  return <span className="truncated-id">{truncatedId}</span>;
};
