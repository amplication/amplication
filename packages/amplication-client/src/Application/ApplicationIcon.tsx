import React from "react";

import "./ApplicationIcon.scss";

type Props = {
  name: string;
  color?: string;
};

function ApplicationIcon({ name, color }: Props) {
  return (
    <div className="application-icon" style={{ backgroundColor: color }}>
      {name && name.substr(0, 1).toUpperCase()}
    </div>
  );
}

export default ApplicationIcon;
