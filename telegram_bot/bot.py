import os
from telethon import TelegramClient
from pymongo import MongoClient
from datetime import datetime

# Setup Telegram Client
api_id = 'your_api_id'
api_hash = 'your_api_hash'
bot_token = 'your_bot_token'
client = TelegramClient('session_name', api_id, api_hash)

# Setup MongoDB connection
mongo_client = MongoClient('mongodb+srv://idopop3:<password>@oni.a8z7e6x.mongodb.net')
db = mongo_client['message_db']
messages_collection = db['messages']

# Save message to MongoDB
def save_telegram_message(telegram_user_id, telegram_username, message_text):
    message_data = {
        "telegram_user_id": telegram_user_id,
        "telegram_username": telegram_username,
        "message_text": message_text,
        "timestamp": datetime.now().strftime("%d:%m:%Y %H:%M:%S"),
        "direction": "telegram_to_whatsapp"
    }
    messages_collection.insert_one(message_data)

# Handle new message
@client.on(events.NewMessage())
async def handle_new_message(event):
    message = event.message
    user_id = event.sender_id
    username = message.sender.username if message.sender else 'Unknown'
    message_text = message.text

    # Save to MongoDB
    save_telegram_message(user_id, username, message_text)

    # Send message to WhatsApp (call Node.js API here or direct integration)
    # Example: send_message_to_whatsapp(user_id, username, message_text)

# Start the client
client.start()
client.run_until_disconnected()

