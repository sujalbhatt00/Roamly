require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { google } = require('googleapis');
const readline = require('readline');

async function main() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
    prompt: 'consent'
  });
  console.log('\nOpen this URL in your browser:\n', authUrl, '\n');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('After allowing access, paste the code here: ', async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code.trim());
      console.log('\nREFRESH_TOKEN:', tokens.refresh_token);
      console.log('ACCESS_TOKEN (short-lived):', tokens.access_token || '(none)');
      console.log('Full tokens:', tokens);
    } catch (err) {
      console.error('Error getting tokens:', err);
    }
    process.exit(0);
  });
}
main().catch(console.error);