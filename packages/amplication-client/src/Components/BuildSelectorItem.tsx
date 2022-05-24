import React from "react";

type Props = {
  title: string;
};
export const BuildSelectorItem = ({
  title,
}: Props) => {
  return (
    <span>
      { title}
    </span>
  );
};
