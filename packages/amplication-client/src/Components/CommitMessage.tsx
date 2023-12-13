import { Commit } from "../models";
import { TruncatedId } from "./TruncatedId";

type Props = {
  commit: Commit;
};

export const CommitMessage = ({ commit }: Props) => {
  if (!commit.message) {
    return (
      <>
        Commit - <TruncatedId id={commit.id} />
      </>
    );
  }

  return <>{commit.message}</>;
};
