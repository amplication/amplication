import classNames from "classnames";
import React from "react";
import { Helmet } from "react-helmet";
import "./PageContent.scss";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

export enum EnumPageWidth {
  Default = "default",
  Full = "full",
}

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  pageWidth?: EnumPageWidth;
  contentTitle?: string;
};

const CLASS_NAME = "amp-page-content";

function PageContent({
  children,
  sideContent,
  className,
  pageTitle,
  headerContent,
  pageWidth = EnumPageWidth.Default,
  contentTitle,
}: Props) {
  return (
    <>
      <Helmet>
        <title>{`Amplication${pageTitle ? ` | ${pageTitle}` : ""}`}</title>
      </Helmet>
      <div
        className={classNames(
          CLASS_NAME,
          `${CLASS_NAME}--width-${pageWidth}`,
          className
        )}
      >
        <div className={`${CLASS_NAME}__header`}>{headerContent}</div>
        <div className={`${CLASS_NAME}__body`}>
          {sideContent && (
            <div className={`${CLASS_NAME}__side`}>{sideContent}</div>
          )}
          <main className={`${CLASS_NAME}__main`}>
            {contentTitle && (
              <FlexItem margin={EnumFlexItemMargin.Bottom}>
                <Text textStyle={EnumTextStyle.H4}>{contentTitle}</Text>
              </FlexItem>
            )}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default PageContent;
