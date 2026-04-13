import dotenv from 'dotenv';

dotenv.config();

const credentialsList: string[] = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_CLIENT_ID',
  'FACEBOOK_CLIENT_SECRET',
  'LINE_CHANNEL_ID',
  'LINE_CHANNEL_SECRET',
];

credentialsList.map((credential) => {
  if (!process.env[credential]) {
    console.warn(
      `Warning: Missing environment variable: ${credential}. ` +
        'Some social login providers may not work.',
    );
  }
});

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/google/callback`,
  scope: ['profile', 'email'],
};

export const facebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID || '',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  callbackURL: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/facebook/callback`,
};

export const lineConfig = {
  channelID: process.env.LINE_CHANNEL_ID || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  callbackURL: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/line/callback`,
};
