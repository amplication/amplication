import {
  CircularProgress,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  Snackbar,
} from "@amplication/ui/design-system";
import { formatError } from "../util/error";
import CompareBlockVersions from "../VersionControl/CompareBlockVersions";
import useCompareResourceVersions from "./hooks/useCompareResourceVersions";

type Props = {
  resourceId: string;
  sourceVersion: string;
  targetVersion: string;
};

function CompareResourceVersions({
  resourceId,
  sourceVersion,
  targetVersion,
}: Props) {
  const { data, loading, error } = useCompareResourceVersions(
    resourceId,
    sourceVersion,
    targetVersion
  );

  const errorMessage = formatError(error);

  return (
    <>
      {loading ? (
        <CircularProgress centerToParent />
      ) : (
        <FlexItem
          direction={EnumFlexDirection.Column}
          gap={EnumGapSize.None}
          itemsAlign={EnumItemsAlign.Stretch}
          contentAlign={EnumContentAlign.Start}
        >
          {data?.compareResourceVersions?.createdBlocks?.map((block) => (
            <CompareBlockVersions
              oldVersion={null}
              newVersion={block}
              key={block.id}
            ></CompareBlockVersions>
          ))}
          {data?.compareResourceVersions?.deletedBlocks?.map((block) => (
            <CompareBlockVersions
              oldVersion={block}
              newVersion={null}
              key={block.id}
            ></CompareBlockVersions>
          ))}
          {data?.compareResourceVersions?.updatedBlocks?.map((diff) => (
            <CompareBlockVersions
              oldVersion={diff.sourceBlockVersion}
              newVersion={diff.targetBlockVersion}
              key={diff.sourceBlockVersion.id}
            ></CompareBlockVersions>
          ))}
        </FlexItem>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default CompareResourceVersions;
