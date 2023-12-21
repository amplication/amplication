import React, { useCallback } from "react";
import "./ToggleButton.scss";

export type Props = {
  label: string;
  selected: boolean;
  onClick: (selected: boolean) => void;
};

export const ToggleButton = ({ label, selected, onClick }: Props) => {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onClick(event.target.checked);
    },
    [onClick]
  );

  return (
    <div className="toggle-button">
      <label>
        <input
          title={label}
          type="checkbox"
          checked={selected}
          onChange={handleInputChange}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};
