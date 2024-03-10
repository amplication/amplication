import {
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import "./OnboardingPreview.scss";

const CLASS_NAME = "onboarding-preview";

const OnboardingPreviewSuccess: React.FC = () => {
  return (
    <>
      <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Center}>
        The code for your service is on&nbsp;its&nbsp;way&nbsp;
        <span role="img" aria-label="rocket emoji">
          🚀
        </span>
      </Text>
      <Text
        textStyle={EnumTextStyle.Description}
        textAlign={EnumTextAlign.Center}
        textColor={EnumTextColor.White}
      >
        You will soon receive an email with a link to a GitHub repo with the
        code for your service.
      </Text>

      <span
        role="img"
        aria-label="party emoji"
        className={`${CLASS_NAME}__party`}
      >
        🎉
      </span>
      <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Left}>
        What's next?
      </Text>
      <ul>
        <li>
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            textColor={EnumTextColor.White}
          >
            <strong>Add data models, configure your API, and more:</strong>{" "}
            Follow the link in your email to to manage your service.
          </Text>
        </li>
        <li>
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            textColor={EnumTextColor.White}
          >
            <strong>Manage your code:</strong> Connect to your own Git
            repository for seamless code management.
          </Text>
        </li>
        <li>
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            textColor={EnumTextColor.White}
          >
            <strong>Innovate and expand:</strong> Clone the code to freely
            incorporate your business logic.
          </Text>
        </li>
        <li>
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            textColor={EnumTextColor.White}
          >
            <strong>Continuous improvement:</strong> Keep evolving your project
            in Amplication for automatic new PRs, bringing even more value to
            your application.
          </Text>
        </li>
      </ul>
    </>
  );
};

export default OnboardingPreviewSuccess;
