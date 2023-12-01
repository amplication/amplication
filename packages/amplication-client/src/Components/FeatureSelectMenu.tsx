import { SelectMenu, SelectMenuProps } from "@amplication/ui/design-system";
import withFeatureControl, {
  WithFeatureControlProps,
} from "./WithFeatureControl";

interface EnhancedSelectMenuProps
  extends SelectMenuProps,
    WithFeatureControlProps {
  iconType?: "lock" | "dimond" | null;
}

export const FeatureSelectMenu = ({
  iconType,
  ...props
}: EnhancedSelectMenuProps) => {
  const renderIcon = () => {
    switch (iconType) {
      case "lock":
        return "lock";
      case "dimond":
        return "dimond";
      default:
        return null;
    }
  };
  return <SelectMenu icon={renderIcon()} {...props} />;
};

export const EnhancedSelectMenu = withFeatureControl(FeatureSelectMenu);
