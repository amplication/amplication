import React from "react";
import "./SupportMenu.scss";

const CLASS_NAME = "support-menu";

const SupportMenu = () => {
  return (
    <div className={CLASS_NAME}>
      <a href="https://docs.amplication.com" target="_blank" rel="noopener">
        Docs
      </a>
      <a href="https://discord.gg/b8MrjU6" target="_blank" rel="noopener">
        Community
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title="
        target="_blank"
        rel="noopener"
      >
        Report an issue
      </a>
      <a
        href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title="
        target="_blank"
        rel="noopener"
      >
        Submit a feature request
      </a>
    </div>
  );
};

export default SupportMenu;
