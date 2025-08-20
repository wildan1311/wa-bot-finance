import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import { Message } from "../node_modules/whatsapp-web.js/index";
import { financeTrack } from './libs/finance.ts';
import dotenv from 'dotenv';
import CUSTOMERS from './const/customers.ts';

dotenv.config();

const client = new Client({
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
    authStrategy: new LocalAuth()
});

client.once('ready', async () => {
    console.log('Client is ready!');
    // for(const customer of CUSTOMERS) {
    //     console.log(`Sending welcome message to ${customer}`);
    //     await client.sendMessage(customer.chatId + "@g.us", 'Hi, I am ready to assist you with your financial tracking. Please send me your transaction details in the format: "Date, Contact, Description, Category, Nominal".');
    // }
});

// When the client received QR-Code
client.on('qr', (qr: string) => {
    // Generate and display the QR code in the terminal
    qrcode.generate(qr, { small: true });
    console.log('QR Code received, scan it!');
});

// client.on('message_create', async (message:Message) => {
// 	if (message.body === '!ping') {
//         try {
//             await createSpreadsheet("Test Spreadsheet");
//         } catch (error) {
//             console.error('Error processing ping message:', error);
//         }
//         // message.body = 'saya wildan, @6285706015892 beli matcha 50000, ayam 16000, parkir 3000';
//         // await financeTrack(message);

// 		// client.sendMessage(message.from, 'Hi, i trying using whastapp bot on my phone');
// 	}
// });

client.on('message', async (message:Message) => {
    try {
        await financeTrack(message);
    } catch (error: any) {
        console.error('Error processing message:', error);
        const chat = await message.getChat();
        chat.sendMessage("Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.");
        client.sendMessage('6285706015892@c.us', `Error processing message: ${error.message}`);
    }
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    for(const customer of CUSTOMERS) {
        client.sendMessage(customer.chatId + '@g.us', 'Sorry, Bot is disconnected right now, if you need assistance, please try again later, or you can also contact support.');
    }
});

client.on('auth_failure', (message) => {
    console.error('Authentication failed, please check your credentials and try again.', message);
});

client.on('change_state', (state) => {
    console.log('Change state:', state);
});

// Start your client
client.initialize();

process.on('SIGTERM', async () => {
  console.log('[SIGNAL] SIGTERM diterima. Menutup aplikasi...');

  client.destroy(); // Hentikan client WhatsApp
  console.log('Client WhatsApp telah dihentikan.');

  process.exit(0); // keluar normal
});

// console.log(createSpreadsheet("Test Spreadsheet"));