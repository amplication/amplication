import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import "./CreateServiceWizardLayout.scss";

const className = "create-service-wizard-layout";

export const CreateServiceWizardLayout = ({ children }) => {
  return (
    <div className={className}>
      <div className={`${className}__wrapper`}>{children}</div>
    </div>
  );
};

CreateServiceWizardLayout.Split = ({ children }) => {
  return (
    <div className={`${className}__split`}>
      <div className={`${className}__wrapper`}>{children}</div>
    </div>
  );
};

CreateServiceWizardLayout.LeftSide = ({ children }) => {
  return <div className={`${className}__left`}>{children}</div>;
};

CreateServiceWizardLayout.Description = ({ header, text }) => {
  return (
    <FlexItem
      className={`${className}__description`}
      direction={EnumFlexDirection.Column}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Large}
      margin={EnumFlexItemMargin.Bottom}
    >
      <Text textStyle={EnumTextStyle.H2}>{header}</Text>
      <Text textAlign={EnumTextAlign.Center}>{text}</Text>
    </FlexItem>
  );
};
CreateServiceWizardLayout.DescriptionCustom = ({ header, text }) => {
  return (
    <div className={`${className}__description`}>
      <div className={`${className}__description__header`}>{header}</div>
      {text}
    </div>
  );
};

CreateServiceWizardLayout.RightSide = ({ children }) => {
  return <div className={`${className}__right`}>{children}</div>;
};

CreateServiceWizardLayout.SelectorWrapper = ({ children }) => {
  return <div className={`${className}__selector_wrapper`}>{children}</div>;
};

CreateServiceWizardLayout.ContentWrapper = ({ children }) => {
  return <div className={`${className}__content_wrapper`}>{children}</div>;
};
