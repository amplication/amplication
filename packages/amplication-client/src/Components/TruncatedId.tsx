import React, { useMemo } from "react";
import { truncateId } from "../util/truncatedId";

type Props = {
  id: string;
};

export const TruncatedId = ({ id }: Props) => {
  const truncatedId = useMemo(() => {
    return truncateId(id);
  }, [id]);

  return <span className="truncated-id">{truncatedId}</span>;
};
