import { CircleBadge, Icon, ToggleField } from "@amplication/design-system";
import "./IconDescriptionToggle.scss";

const className = "icon-description-toggle";

export type Props = {
  name: string;
  icon: string;
  description: string;
};

export const IconDescriptionToggle: React.FC<Props> = ({
  name,
  icon,
  description,
}) => {
  return (
    <div className={className}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <Icon icon={icon} size="small" />
      </CircleBadge>
      <label>{description}</label>
      <ToggleField name={name} label="" />
    </div>
  );
};
