const { makeWASocket, useSingleFileAuthState, AnyMessageContent, proto } = require('@adiwajshing/baileys');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB Connection
const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db("message_db");
const messagesCollection = db.collection("messages");

// WhatsApp Client Setup
const { state, saveCreds } = useSingleFileAuthState('./auth_info.json'); // Pastikan path sesuai
const client = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['Baileys', 'Safari', '1.0']
});

// Listen for new messages
client.ev.on('messages.upsert', async (msg) => {
    const message = msg.messages[0];
    if (!message.key.fromMe) {
        console.log(message);
    }
});

// Send a message to WhatsApp
async function send_message_to_whatsapp(messageText, whatsappNumber) {
    await client.sendMessage(whatsappNumber, { text: messageText });
}

client.connect()
    .then(() => console.log("WhatsApp bot connected"))
    .catch(err => console.log(err));
