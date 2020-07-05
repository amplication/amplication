import React, { useState, useCallback } from "react";
import { IconButton } from "@rmwc/icon-button";
import "./SearchField.scss";

type Props = {
  label: string;
  placeholder: string;
  onChange: (searchPhrase: string) => void;
};

const SearchField = ({ label, placeholder, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");

  /**@todo: add timer to raise event only after minimal idle time  */
  const handleInputChange = useCallback(
    (event) => {
      setInputValue(event.target.value);
      onChange(event.target.value);
    },
    [setInputValue, onChange]
  );

  return (
    <div className={`search-field ${isOpen ? " search-field--open" : ""}`}>
      {!isOpen && (
        <IconButton icon="search" onClick={() => setIsOpen(!isOpen)} />
      )}
      {isOpen && (
        <div className="search-field__text">
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <IconButton icon="close" onClick={() => setIsOpen(!isOpen)} />
        </div>
      )}
    </div>
  );
};
export default SearchField;
