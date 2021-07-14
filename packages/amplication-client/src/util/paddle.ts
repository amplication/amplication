import { REACT_APP_PADDLE_VENDOR_ID } from "../env";

const PADDLE_SANDBOX_VENDOR_ID = "2673";

export function init() {
  if (REACT_APP_PADDLE_VENDOR_ID) {
    //@ts-ignore
    const Paddle = window.Paddle;

    if (REACT_APP_PADDLE_VENDOR_ID === PADDLE_SANDBOX_VENDOR_ID) {
      Paddle.Environment.set("sandbox");
    }

    Paddle.Setup({ vendor: +REACT_APP_PADDLE_VENDOR_ID }); //use + since vendor_id must be integer
  }
}
