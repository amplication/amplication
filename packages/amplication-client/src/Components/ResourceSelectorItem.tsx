import { Resource } from "../models";
import "./CommitSelectorItem.scss";
import ResourceTypeBadge from "./ResourceTypeBadge";

type Props = {
  resource: Resource | null;
};
const CLASS_NAME = "commit-selector-item";

export const ResourceSelectorItem = ({ resource }: Props) => {
  return (
    <div className={CLASS_NAME}>
      {resource ? (
        <>
          <ResourceTypeBadge resource={resource} size={"xsmall"} />
          <div className={`${CLASS_NAME}__title`}>{resource?.name}</div>
        </>
      ) : (
        <div className={`${CLASS_NAME}__title`}>none</div>
      )}
    </div>
  );
};
