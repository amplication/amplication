import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";

type Props = {
  label: string;
  value: string;
  onRemove: (value: string) => void;
};

const OptionSetItem = ({ label, value, onRemove }: Props) => {
  const handleRemove = useCallback(
    (event) => {
      onRemove(value);
    },
    [onRemove, value]
  );

  return (
    <div className="option-set_option">
      {label} ({value})
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.Clear}
        icon="delete_outline"
        onClick={handleRemove}
        title="Remove Item"
      />
    </div>
  );
};

export default OptionSetItem;
