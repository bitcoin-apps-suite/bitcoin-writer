declare module '@handcash/handcash-connect' {
  export interface HandCashConnectOptions {
    appId: string;
    appSecret?: string;
  }

  export interface PublicProfile {
    handle?: string;
    paymail?: string;
    displayName?: string;
    avatarUrl?: string;
    id?: string;
  }

  export interface Profile {
    handle?: string;
    paymail?: string;
    displayName?: string;
    avatarUrl?: string;
    id?: string;
    publicProfile?: PublicProfile;
  }

  export interface ProfileAPI {
    getCurrentProfile(): Promise<Profile>;
  }

  export interface CloudAccount {
    profile: ProfileAPI;
  }

  export class HandCashConnect {
    constructor(options: HandCashConnectOptions);
    getAccountFromAuthToken(authToken: string): CloudAccount;
  }
}