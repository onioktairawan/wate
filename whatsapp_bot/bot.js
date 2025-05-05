const { MongoClient } = require("mongodb");
const { default: makeWASocket, useMultiFileAuthState, disconnect, makeWaSocket } = require('@adiwajshing/baileys');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB Connection
const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db("message_db");
const messagesCollection = db.collection("messages");

// WhatsApp Client Setup
const { state, saveCreds } = useMultiFileAuthState('./auth_info');
const client = makeWaSocket({
    printQRInTerminal: true,
    auth: state
});

client.ev.on('messages.upsert', async (msg) => {
    const message = msg.messages[0];
    if (!message.key.fromMe) {
        // Fetch the Telegram message from MongoDB
        const telegramMessage = await messagesCollection.findOne({ 'whatsapp_message_id': message.key.id });
        
        if (telegramMessage) {
            // Send message to Telegram (use Telegram API)
            // Example: send_message_to_telegram(telegramMessage.telegram_user_id, message.text);
        }
    }
});

// Send message to WhatsApp
async function send_message_to_whatsapp(messageText, whatsappNumber) {
    await client.sendMessage(whatsappNumber, { text: messageText });
}

client.connect()
    .then(() => console.log("WhatsApp bot connected"))
    .catch(err => console.log(err));

