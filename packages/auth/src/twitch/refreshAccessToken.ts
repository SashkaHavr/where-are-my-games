import type { OAuth2Tokens, ProviderOptions } from 'better-auth/oauth2';
import { base64Url } from '@better-auth/utils/base64';
import { betterFetch } from '@better-fetch/fetch';

export async function refreshAccessToken(
  refreshToken: string,
  options: { clientId: string; clientSecret: string },
) {
  return refreshAccessTokenInternal({
    refreshToken,
    options: {
      clientId: options.clientId,
      clientSecret: options.clientSecret,
    },
    tokenEndpoint: 'https://id.twitch.tv/oauth2/token',
  });
}

export async function refreshAccessTokenInternal({
  refreshToken,
  options,
  tokenEndpoint,
  authentication,
  extraParams,
  grantType = 'refresh_token',
}: {
  refreshToken: string;
  options: ProviderOptions;
  tokenEndpoint: string;
  authentication?: 'basic' | 'post';
  extraParams?: Record<string, string>;
  grantType?: string;
}): Promise<OAuth2Tokens> {
  const body = new URLSearchParams();
  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
  };

  body.set('grant_type', grantType);
  body.set('refresh_token', refreshToken);
  if (authentication === 'basic') {
    const encodedCredentials = base64Url.encode(
      `${options.clientId}:${options.clientSecret}`,
    );
    headers.authorization = `Basic ${encodedCredentials}`;
  } else {
    body.set('client_id', options.clientId);
    body.set('client_secret', options.clientSecret);
  }

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      body.set(key, value);
    }
  }

  const { data, error } = await betterFetch<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string[];
    id_token?: string;
  }>(tokenEndpoint, {
    method: 'POST',
    body,
    headers,
  });
  if (error) {
    throw error;
  }
  const tokens: OAuth2Tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    scopes: data.scope,
    idToken: data.id_token,
  };

  if (data.expires_in != undefined) {
    const now = new Date();
    tokens.accessTokenExpiresAt = new Date(
      now.getTime() + data.expires_in * 1000,
    );
  }

  return tokens;
}
