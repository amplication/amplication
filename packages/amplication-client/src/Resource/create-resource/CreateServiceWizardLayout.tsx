import "./CreateServiceWizardLayout.scss";

const className = "create-service-wizard-layout";

export const CreateServiceWizardLayout = ({ children }) => {
  return <div className={className}>{children}</div>;
};

CreateServiceWizardLayout.Split = ({ children }) => {
  return <div className={`${className}__split`}>{children}</div>;
};

CreateServiceWizardLayout.LeftSide = ({ children }) => {
  return <div className={`${className}__left`}>{children}</div>;
};

CreateServiceWizardLayout.Description = ({ header, text }) => {
  return (
    <div className={`${className}__description`}>
      <div className={`${className}__description__header`}>{header}</div>
      <div className={`${className}__description__text`}>{text}</div>
    </div>
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
