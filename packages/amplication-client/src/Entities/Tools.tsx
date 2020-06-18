import React from "react";
import { Link } from "react-router-dom";
import { Ripple } from "@rmwc/ripple";
import "@rmwc/ripple/styles";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/styles";
import "./Tools.scss";

const Tool = ({
  title,
  icon,
  link,
}: {
  title: string;
  icon: string;
  link: string;
}) => {
  return (
    <Ripple>
      <Link className="tool" to={link}>
        <Icon className="icon" icon={icon} />
        {title}
      </Link>
    </Ripple>
  );
};

const Tools = () => {
  return (
    <div className="tools">
      <Tool icon="search" title="Entity" link="entities/new" />
      <Tool icon="search" title="Option Set" link="entities/new" />
      <Tool icon="search" title="Structure" link="entities/new" />
      <hr />
      <Tool icon="search" title="Data Source" link="entities/new" />
    </div>
  );
};

export default Tools;
