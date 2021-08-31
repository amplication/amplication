import { registerEnumType } from '@nestjs/graphql';

/**
 * must work with the conventions of https://github.com/vercel/ms
 * because JWTModule work with ms https://github.com/nestjs/jwt#jwtservicedecodetoken-string-options-decodeoptions-object--string
 */
export enum EnumJwtTimeScaleType {
  Minutes = 'minutes',
  Hours = 'hours',
  Day = 'day',
  Weeks = 'weeks',
  Years = 'years'
}

registerEnumType(EnumJwtTimeScaleType, {
  name: 'EnumJwtTimeScaleType'
});
