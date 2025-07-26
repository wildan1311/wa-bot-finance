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
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

client.on('message_create', async (message:Message) => {
	if (message.body === '!ping') {
        message.body = 'saya wildan, @6285706015892 25 July 2025 beli matcha 50000, ayam 16000, parkir 3000';
        await financeTrack(message);

		client.sendMessage(message.from, 'Hi, i trying using whastapp bot on my phone');
	}
});

client.on('message', async (message:Message) => {
    await financeTrack(message);
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