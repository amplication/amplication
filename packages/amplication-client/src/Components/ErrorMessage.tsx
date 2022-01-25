import {Icon} from "@rmwc/icon";
import React from "react";
import classNames from "classnames";

import './ErrorMessage.scss';

type Props = {
    errorMessage: string | string[] | undefined | null;
    className?: string;
}

const CLASS_NAME = 'amp-error-message';

export const ErrorMessage = ({ errorMessage, className }: Props) => {
    return (
        <div className={classNames(CLASS_NAME, className)}>
            <Icon icon="alert_circle" />
            {errorMessage}
        </div>
    )
}