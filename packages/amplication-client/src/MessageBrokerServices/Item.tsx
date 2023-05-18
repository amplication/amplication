import React from "react";
import { NavLink } from "react-router-dom";
import { Resource } from "../models";
import "./Item.scss";

type Props = {
  link: string;
  service: Resource;
};

const CLASS_NAME = "services-page__list__item";

const description = "See connected services.";

const Item = ({ link, service }: Props) => {
  return (
    <NavLink to={link}>
      <div className={`${CLASS_NAME}`}>
        <div className={`${CLASS_NAME}__header`}>
          <div className={`${CLASS_NAME}__header__title`}>{service.name}</div>
        </div>
        <div className={`${CLASS_NAME}__description`}>{description}</div>
      </div>
    </NavLink>
  );
};

export { Item };
