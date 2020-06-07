import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/styles";

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
    <Link to={link}>
      <Button>
        <Icon icon={icon} />
        {title}
      </Button>
    </Link>
  );
};

const Tools = () => {
  return (
    <div>
      <Tool icon="search" title="Entity" link="entities/new" />
      <Tool icon="search" title="Option Set" link="entities/new" />
      <Tool icon="search" title="Structure" link="entities/new" />
      <hr />
      <Tool icon="search" title="Data Source" link="entities/new" />
    </div>
  );
};

export default Tools;
