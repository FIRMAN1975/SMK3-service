export interface JwtPayload {
  sub: string;
  preferred_username: string;
  email?: string;
  aud?: string | string[];
  azp?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}

export interface AuthUser {
  sub: string;
  username: string;
  email?: string;
  roles: string[]; // sudah normalized (realm + client, unique)
}
