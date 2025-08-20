import { google } from 'googleapis';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  keyFile: path.join(process.cwd(), 'service.json'),
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const sheets = google.sheets({version: 'v4', auth});

const drive = google.drive({version: 'v3', auth});

export { sheets, drive };