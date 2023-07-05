import {
  Button,
  EnumButtonStyle,
  Icon,
  ContactUsLinkForEnterprise,
} from "@amplication/ui/design-system";
import { EnumGitProvider } from "../../../models";
import { useCallback } from "react";

import "./GitProviderConnection.scss";
import classNames from "classnames";

import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { PROVIDERS_DISPLAY_NAME } from "../../constants";

const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#F85B6E",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#15192C",
    color: "#ffffff",
    maxWidth: 360,
    border: "1px solid #F85B6E",
    borderRadius: "4px",
    padding: "6px",
    fontFamily: "unset",
    fontSize: "10px",
    fontWeight: "unset",
  },
}));

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
  disabled?: boolean;
  comingSoon?: boolean;
};

const CLASS_NAME = "git-provider-connection";

export default function GitProviderConnection({
  onSyncNewGitOrganizationClick,
  provider,
  disabled,
  comingSoon,
}: Props) {
  const handleClick = useCallback(() => {
    onSyncNewGitOrganizationClick(provider);
  }, [provider]);

  const contactUsLink = "https://amplication.com/contact-us";

  const providerDisplayName = PROVIDERS_DISPLAY_NAME[provider];

  return (
    <div
      className={classNames(CLASS_NAME, { enabled: !comingSoon && !disabled })}
    >
      <img
        src={`../../../../assets/images/${provider?.toLowerCase()}.svg`}
        alt=""
      />
      <div className={`${CLASS_NAME}__name`}>{providerDisplayName}</div>
      <div className={`${CLASS_NAME}__controls`}>
        {disabled && (
          <WarningTooltip
            arrow
            placement="top-start"
            title={
              <div className={`${CLASS_NAME}__tooltip__window`}>
                <Icon icon="info_circle" />
                <div className={`${CLASS_NAME}__tooltip__window__info`}>
                  <span>
                    This feature requires an Enterprise plan.
                    <br />
                    For more information,
                  </span>{" "}
                  <ContactUsLinkForEnterprise
                    link={contactUsLink}
                    handleClick={() => {
                      window.open(contactUsLink, "_blank");
                    }}
                  />
                </div>
              </div>
            }
          >
            <img
              className={`${CLASS_NAME}__lock`}
              src={`../../../../assets/images/lock.svg`}
              alt=""
            />
          </WarningTooltip>
        )}
        {!comingSoon ? (
          <Button
            className={`${CLASS_NAME}__connect`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleClick}
            disabled={disabled}
          >
            Connect
          </Button>
        ) : (
          <div className={`${CLASS_NAME}__coming_soon`}>Coming soon</div>
        )}
      </div>
    </div>
  );
}
