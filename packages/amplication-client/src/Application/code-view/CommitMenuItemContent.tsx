import React from "react";

type Props = {
  title: string;
  isMenuTitle?: Boolean;
};
export const CommitMenuItemContent = ({
  title,
  isMenuTitle = false,
}: Props) => {
  return (
    <span>
      {/* <img
        className={`${CLASS_NAME}`}
        src={githubOrganizationImageUrl(name)}
        alt="Git organization"
      /> */}
      {isMenuTitle ? `${title} connected` : title}
    </span>
  );
};
