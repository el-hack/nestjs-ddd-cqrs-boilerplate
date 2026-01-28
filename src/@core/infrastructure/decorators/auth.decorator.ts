import { CustomDecorator, SetMetadata } from '@nestjs/common';

export enum AuthType {
  BearerToken,
  None,
}

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: AuthType[]): CustomDecorator<string> =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
