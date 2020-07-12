import React, { useCallback } from "react";
import { Chip } from "@rmwc/chip";
import "@rmwc/chip/styles";

type Props = {
  objectData: any;
  text: string;
  selected: boolean;
  onSelectionChange: (objectData: any) => void;
};

const BlockListFilterItem = ({
  objectData,
  text,
  selected,
  onSelectionChange,
}: Props) => {
  const handleSelectionChange = useCallback(() => {
    onSelectionChange(objectData);
  }, [onSelectionChange, objectData]);

  return (
    <Chip
      label={text}
      selected={selected}
      checkmark
      onInteraction={handleSelectionChange}
    />
  );
};
export default BlockListFilterItem;
