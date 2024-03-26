import {
  Button,
  CircleBadge,
  Dialog,
  EnumButtonStyle,
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useTracking } from "../util/analytics";
import React from "react";
import "./InfoButton.scss";

const CLASS_NAME = "info-button";

type Props = {
  icon?: string;
  title?: string;
  tooltipIcon?: string;
  explanation: string;
  linkText?: string;
  linkUrl?: string;
  linkPlaceHolder?: string;
  endnotes?: string;
};

export const InfoButton = ({
  explanation,
  title,
  endnotes,
  linkUrl,
  linkPlaceHolder,
  linkText = "Contact us",
  icon = "info_i",
}: Props) => {
  const { trackEvent } = useTracking();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleInfoButtonClicked = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggleIsOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleContactUsClick = useCallback(() => {
    window.open(linkUrl, "_blank");
    trackEvent({
      eventName: AnalyticsEventNames.ContactUsButtonClick,
      action: "Contact Us",
      eventOriginLocation: "InfoButton",
    });
  }, [linkUrl, trackEvent]);

  const renderDialogContent = useMemo(() => {
    return (
      <div>
        {explanation.split("\n").map((line, lineIndex, lineArray) => {
          if (line.includes(linkPlaceHolder)) {
            const parts = line.split(linkPlaceHolder);
            return (
              <div key={lineIndex} className={`${CLASS_NAME}__contact-us-ink`}>
                {parts[0]}
                <Link
                  onClick={handleContactUsClick}
                  style={{ color: "#53dbee" }}
                  to="#"
                >
                  {linkText}
                </Link>
                {parts[1]}
                {lineIndex < lineArray.length - 1 && <br />}
              </div>
            );
          } else {
            return (
              <React.Fragment key={lineIndex}>
                <Text>{line}</Text>
                {lineIndex < lineArray.length - 1 && <br />}
              </React.Fragment>
            );
          }
        })}
      </div>
    );
  }, [explanation, handleContactUsClick, linkPlaceHolder, linkText]);

  return (
    <div className={CLASS_NAME}>
      <Button
        buttonStyle={EnumButtonStyle.Text}
        onClick={handleInfoButtonClicked}
      >
        <CircleBadge size={"xxsmall"} themeColor={EnumTextColor.ThemeBlue}>
          <Icon icon={icon} size="xsmall" color={EnumTextColor.White} />
        </CircleBadge>
      </Button>
      <Dialog isOpen={isOpen} onDismiss={toggleIsOpen} title={title}>
        <>
          <Text>{renderDialogContent}</Text>
          {endnotes && <Text textStyle={EnumTextStyle.Tag}>{endnotes}</Text>}
        </>
      </Dialog>
    </div>
  );
};
