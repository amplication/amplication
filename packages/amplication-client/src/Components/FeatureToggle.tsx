import { ToggleField, ToggleFieldProps } from "@amplication/ui/design-system";
import withFeatureControl, {
  WithFeatureControlProps,
} from "./WithFeatureControl";

interface EnhancedToggleFieldProps
  extends ToggleFieldProps,
    WithFeatureControlProps {}

export const FeatureToggle = (props: EnhancedToggleFieldProps) => {
  return <ToggleField {...props} />;
};

export const EnhancedFeatureToggle = withFeatureControl(FeatureToggle);
