import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";

export enum IdentityProvider {
  GitHub = "GitHub",
  IdentityPlatform = "Auth0",
  Local = "Local",
  PreviewAccount = "PreviewAccount",
}

export type IdentityProviderPreview =
  `${IdentityProvider.PreviewAccount}_${EnumPreviewAccountType}`;
