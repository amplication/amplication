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

export function createSubscription(
  productId: number,
  workspaceId: string,
  onSuccess: () => void
) {
  //@ts-ignore
  const Paddle = window.Paddle;

  Paddle.Checkout.open({
    product: productId,
    passthrough: JSON.parse(JSON.stringify({ workspaceId: workspaceId })),
    successCallback: onSuccess,
  });
}

export function cancelSubscription(
  cancelUrl: string,
  workspaceId: string,
  onSuccess: () => void
) {
  //@ts-ignore
  const Paddle = window.Paddle;

  Paddle.Checkout.open({
    override: cancelUrl,
    passthrough: JSON.parse(JSON.stringify({ workspaceId: workspaceId })),
    successCallback: onSuccess,
  });
}

export function updateSubscription(
  updateUrl: string,
  workspaceId: string,
  onSuccess: () => void
) {
  //@ts-ignore
  const Paddle = window.Paddle;

  Paddle.Checkout.open({
    override: updateUrl,
    passthrough: JSON.parse(JSON.stringify({ workspaceId: workspaceId })),
    successCallback: onSuccess,
  });
}
