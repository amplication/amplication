import { CircleBadge, Icon } from "@amplication/design-system";
import classNames from "classnames";
import { useCallback } from "react";
import "./LabelDescriptionSelector.scss";

const className = "label-description-selector";

export type Props = {
  name: string;
  label: string;
  description: string;
  icon?: string;
  image?: string;
  onClick: (name) => void;
  currentValue: string;
};

export const LabelDescriptionSelector: React.FC<Props> = ({
  name,
  label,
  description,
  icon,
  image,
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
      {icon && (
        <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
          <Icon icon={icon} size="medium" />
        </CircleBadge>
      )}

      {image && (
        <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
          <img className={`${className}__logo`} src={image} alt={""} />
        </CircleBadge>
      )}

      <label>{label}</label>
      <div className={`${className}__description`}>{description}</div>
    </div>
  );
};
