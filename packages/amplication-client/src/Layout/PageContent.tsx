import { TabContentTitle } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import { Helmet } from "react-helmet";
import "./PageContent.scss";

export enum EnumPageWidth {
  Default = "default",
  Full = "full",
}

export enum EnumPageContentPadding {
  Default = "default",
  None = "none",
}

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  pageWidth?: EnumPageWidth;
  contentTitle?: string;
  contentSubTitle?: string;
  pageContentPadding?: EnumPageContentPadding;
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
  contentSubTitle,
  pageContentPadding = EnumPageContentPadding.Default,
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
          `${CLASS_NAME}--content-padding-${pageContentPadding}`,
          className
        )}
      >
        <div className={`${CLASS_NAME}__header`}>{headerContent}</div>
        <div className={`${CLASS_NAME}__body`}>
          {sideContent && (
            <div className={`${CLASS_NAME}__side`}>{sideContent}</div>
          )}

          <main className={`${CLASS_NAME}__main-scroll`}>
            <div className={`${CLASS_NAME}__main`}>
              {contentTitle && (
                <TabContentTitle
                  title={contentTitle}
                  subTitle={contentSubTitle}
                />
              )}
              {children}
              <div className={`${CLASS_NAME}__spacer`} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default PageContent;
