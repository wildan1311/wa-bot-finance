import { FormattedChat } from "../types/types";
import { sheets } from "./google-api-service.ts";

const SHEET_ID = '1cZ1fbrUiNvfKReIsFxfP4nldsjPVHfOuCo9Le_eo9W0';

function formatDataFromChat(data: FormattedChat) {
    return [
        null, data.date, data.contact, data.description, data.category, data.nominal
    ]
}

const writeSheet = async (data: FormattedChat | FormattedChat[]): Promise<string> => {
    const values = Array.isArray(data) ? data.map(item => formatDataFromChat(item)) : [formatDataFromChat(data)];
    console.log({values})

    try {
        sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!B:F', // Mulai dari baris ke-2 ke bawah
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values
            }
        });
        console.log('Data written successfully');
        return `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
    } catch (error) {
        console.error('Error writing to sheet:', error);
        return 'Error writing to sheet';
    }
}

const createSpreadsheet = async (title: string): Promise<string> => {
    try {
        const response = await sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title: title
                }
            }
        });
        const spreadsheetId = response.data.spreadsheetId;
        console.log(`Spreadsheet created with ID: ${spreadsheetId}`);
        return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    } catch (error) {
        console.error('Error creating spreadsheet:', error);
        throw error;
    }
}

export { writeSheet, createSpreadsheet };
