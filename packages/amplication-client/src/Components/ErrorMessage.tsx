import {Icon} from "@rmwc/icon";
import React from "react";

type Props = {
    error: string | string[] | undefined | null;
    className: string;
}

export const LoginErrorMessage = ({error, className}: Props) => {
    return (
        <div>
            {error && (<div className={`${className}__login-error`}>
                <Icon icon="alert_circle" />
                {error}
            </div>)}
        </div>
    )
}