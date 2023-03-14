import { CircleBadge } from "@amplication/design-system";
import "./ImageLabelDescriptionSelector.scss";

const className = "image-label-description-selector";

export type Props = {
  name: string;
  icon: string;
  label: string;
  description: string;
};

export const ImageLabelDescriptionSelector: React.FC<Props> = ({
  name,
  icon,
  label,
  description,
}) => {
  return (
    <div className={className}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <img className={`${className}__logo`} src={icon} alt={""} />
      </CircleBadge>
      <label>{label}</label>
      <div className={`${className}__description`}>{description}</div>
    </div>
  );
};
