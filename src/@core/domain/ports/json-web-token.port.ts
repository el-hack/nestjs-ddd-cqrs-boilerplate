import { Role } from '../enums/role.enum';

export interface JsonWebTokenPayloadType {
  id?: string;
  email?: string;
  role?: Role;
  ownerId?: string;
}

export interface JsonWebTokenVerificationType {
  verificationToken: string;
}

export interface JsonWebTokenAuthenticateType {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticateUser {
  sub?: string;
  refreshTokenId?: string;
  email?: string;
  role?: Role;
  ownerId?: string;
}

export interface ClientVerifyResponse {
  id: string;
  tokenId?: string;
  email?: string;
  role?: Role;
  ownerId?: string;
}

export const JsonWebTokenPortToken = Symbol('JsonWebTokenPort');

export type JsonWebTokenType =
  | JsonWebTokenAuthenticateType
  | JsonWebTokenVerificationType;

export interface JsonWebTokenPort {
  generate(client: JsonWebTokenPayloadType): Promise<JsonWebTokenType>;

  sign(
    clientId: string,
    type: 'refresh' | 'token',
    payload?: AuthenticateUser | Record<string, unknown>,
  ): Promise<string>;

  verify(token: string): Promise<ClientVerifyResponse>;
}
