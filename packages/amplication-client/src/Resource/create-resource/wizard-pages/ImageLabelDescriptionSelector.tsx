import { CircleBadge } from "@amplication/design-system";
import classNames from "classnames";
import { useCallback } from "react";
import "./ImageLabelDescriptionSelector.scss";

const className = "image-label-description-selector";

export type Props = {
  name: string;
  icon: string;
  label: string;
  description: string;
  onClick: (name) => void;
  currentValue: string;
};

export const ImageLabelDescriptionSelector: React.FC<Props> = ({
  name,
  icon,
  label,
  description,
  onClick,
  currentValue,
}) => {
  const onSelectorClick = useCallback(() => {
    onClick(name);
  }, [onClick, name]);

  return (
    <div
      onClick={onSelectorClick}
      className={classNames(className, { selected: name === currentValue })}
    >
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <img className={`${className}__logo`} src={icon} alt={""} />
      </CircleBadge>
      <label>{label}</label>
      <div className={`${className}__description`}>{description}</div>
    </div>
  );
};
