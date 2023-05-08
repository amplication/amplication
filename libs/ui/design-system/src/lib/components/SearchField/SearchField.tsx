import React, { useCallback } from "react";
import { Icon } from "../Icon/Icon";
import "./SearchField.scss";

export type Props = {
  label: string;
  placeholder: string;
  onChange: (searchPhrase: string) => void;
};

const SearchField = ({ label, placeholder, onChange }: Props) => {
  /**@todo: add timer to raise event only after minimal idle time  */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className="search-field">
      <input
        type="text"
        onChange={handleInputChange}
        placeholder={placeholder}
        title={label}
      />
      <Icon icon="search" />
    </div>
  );
};

export default SearchField;
