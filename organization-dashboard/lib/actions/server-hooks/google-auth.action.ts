import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'https://legendary-zebra-45v97xp5wr5fjprq-3000.app.github.dev/api/auth/google-auth',
});

export async function getGoogleAuthUrl() {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'email'],
  });
  return url;
}

export async function getGoogleAccessToken(code: string) {
  try {
    const { tokens } = await client.getToken(code);
    console.log('Access token:', tokens.access_token);
    return tokens.id_token;
  } catch (error: any) {
    console.error('Error getting access token:', error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function getGoogleUserInfo(accessToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('User info:', payload);
    return payload;
  } catch (error: any) {
    console.error('Error verifying ID token:', error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}
