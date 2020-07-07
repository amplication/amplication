import React, { useState, useCallback } from "react";
import { IconButton } from "@rmwc/icon-button";
import classNames from "classnames";
import "./SearchField.scss";

type Props = {
  label: string;
  placeholder: string;
  onChange: (searchPhrase: string) => void;
};

const SearchField = ({ label, placeholder, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**@todo: add timer to raise event only after minimal idle time  */
  const handleInputChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleSearchClick = useCallback(() => {
    if (isOpen) {
      onChange("");
    }
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen, onChange]);

  return (
    <div
      className={classNames("search-field", { "search-field--open": isOpen })}
    >
      {!isOpen ? (
        <IconButton icon="search" onClick={handleSearchClick} />
      ) : (
        <div className="search-field__text">
          <input
            type="text"
            onChange={handleInputChange}
            placeholder={placeholder}
            title={label}
          />
          <IconButton icon="close" onClick={handleSearchClick} />
        </div>
      )}
    </div>
  );
};
export default SearchField;
