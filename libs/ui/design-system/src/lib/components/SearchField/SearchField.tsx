import React, { useCallback } from "react";
import { Icon } from "../Icon/Icon";
import "./SearchField.scss";

export type Props = {
  label: string;
  placeholder: string;
  onChange: (searchPhrase: string) => void;
  value?: string;
};

const SearchField = ({ label, placeholder, onChange, value }: Props) => {
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
        value={value}
      />
      <Icon icon="search" size="xsmall" />
    </div>
  );
};

export default SearchField;
