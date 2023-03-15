import { CircleBadge, Icon, ToggleField } from "@amplication/design-system";
import "./IconLabelToggle.scss";

const className = "icon-label-toggle";

export type Props = {
  name: string;
  icon: string;
  label: string;
};

export const IconLabelToggle: React.FC<Props> = ({ name, icon, label }) => {
  return (
    <div className={className}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <Icon icon={icon} size="small" />
      </CircleBadge>
      <label>{label}</label>
      <ToggleField name={name} label="" />
    </div>
  );
};
