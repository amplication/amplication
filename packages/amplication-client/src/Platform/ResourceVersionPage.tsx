import {
  CircularProgress,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HeaderItemsStripe,
  HeaderItemsStripeItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  Text,
  UserAndTime,
  VersionTag,
} from "@amplication/ui/design-system";
import { useRouteMatch } from "react-router-dom";
import { AutoBackNavigation } from "../Components/AutoBackNavigation";
import { useAppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import { formatError } from "../util/error";
import CompareResourceVersions from "./CompareResourceVersions";
import useResourceVersion from "./hooks/useResourceVersion";

const CLASS_NAME = "outdated-version-page";
const PAGE_TITLE = "Tech Debt Alert";

function ResourceVersionPage() {
  const { currentResource } = useAppContext();

  const match = useRouteMatch<{
    version: string;
  }>([
    "/:workspace/platform/:project/:resource/versions/:version",
    "/:workspace/:project/:resource/versions/:version",
  ]);

  const { version: versionId } = match?.params ?? {};

  const { data, loading, error } = useResourceVersion(versionId);

  const errorMessage = formatError(error);

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      {loading ? (
        <CircularProgress centerToParent />
      ) : !data ? (
        <>
          versionId {versionId}
          "Version Not Found"
        </>
      ) : (
        <>
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Start}
          >
            <AutoBackNavigation />
            <TabContentTitle title="Version Details" />

            <FlexItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
            >
              <FlexItem.FlexStart>
                <HeaderItemsStripe>
                  <HeaderItemsStripeItem
                    label="Version"
                    content={<VersionTag version={data.version} />}
                  />

                  <HeaderItemsStripeItem
                    label="Message"
                    content={
                      <Text textStyle={EnumTextStyle.Description}>
                        {data.message}
                      </Text>
                    }
                  />
                </HeaderItemsStripe>
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd alignSelf={EnumContentAlign.End}>
                <UserAndTime
                  account={data.createdBy?.account}
                  time={data.createdAt}
                />
              </FlexItem.FlexEnd>
            </FlexItem>
          </FlexItem>

          <HorizontalRule />
          <CompareResourceVersions
            resourceId={currentResource?.id}
            sourceVersion={""} //compare to previous version
            targetVersion={data.version}
          />
        </>
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default ResourceVersionPage;
