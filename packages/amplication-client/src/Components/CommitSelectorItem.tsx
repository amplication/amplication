import { Commit } from "../models";
import { CommitMessage } from "./CommitMessage";
import UserBadge from "./UserBadge";
import "./CommitSelectorItem.scss";

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
            <CommitMessage commit={commit} />
          </div>
        </>
      ) : (
        <div className={`${CLASS_NAME}__title`}>none</div>
      )}
    </div>
  );
};
