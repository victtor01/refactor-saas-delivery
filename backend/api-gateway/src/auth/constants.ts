export class JwtConfig {
  private readonly secretKey: string = 'EXAMPLE_KEY';
  private readonly accessTokenExpiration: string = '12s';
  private readonly refreshTokenExpiration: string = '1d';

  getSecretKey = (): string => this.secretKey;
  getAccessTokenExpiration = (): string => this.accessTokenExpiration;
  getRefreshTokenExpiration = (): string => this.refreshTokenExpiration;
}

type Role = 'CLIENT' | 'MANAGER';

export type Session = {
  id: string;
  email: string;
  role: Role;
};

export type SessionStore = {
  id: string;
};

export type SessionManager = {} & Session;

export type SessionClient = {} & Session;
