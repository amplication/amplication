import { Commit } from "../models";
import "./CommitSelectorItem.scss";
import UserBadge from "./UserBadge";

type Props = {
  commit: Commit | null;
};
const CLASS_NAME = "commit-selector-item";

export const CommitSelectorItem = ({ commit }: Props) => {
  return (
    <div className={CLASS_NAME}>
      {commit ? (
        <>
          <UserBadge />
          <div className={`${CLASS_NAME}__title`}>
            {commit.message || `Commit - ${commit.id}`}
          </div>
        </>
      ) : (
        <div className={`${CLASS_NAME}__title`}>none</div>
      )}
    </div>
  );
};
