/**
 * Telegram Bot File Templates for Node.js and Python
 * Configured specifically for GitHub repository upload and Render hosting.
 */

export interface BotConfig {
  token: string;
  botName: string;
  startMessage: string;
  enableEcho: boolean;
  enablePing: boolean;
  port: number;
}

export interface GeneratedFile {
  name: string;
  language: string;
  description: string;
  content: string;
  badge?: string;
}

export function getGeneratedFiles(config: BotConfig, language: 'nodejs' | 'python' = 'nodejs'): GeneratedFile[] {
  const safeToken = config.token.trim() || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
  const safeStartMessage = config.startMessage.trim() || 
    `👋 হ্যালো! আমি আপনার টেলিগ্রাম টেস্ট বট।\n\n🚀 বটটি সফলভাবে GitHub এবং Render এর মাধ্যমে হোস্ট করা হয়েছে!\n\nকমান্ডসমূহ:\n/start - এই মেসেজটি দেখার জন্য\n/ping - বট লাইভ কিনা টেস্ট করতে\n/help - সাহায্য পেতে`;

  if (language === 'nodejs') {
    const indexJsContent = `// ==========================================
// TELEGRAM BOT FOR GITHUB & RENDER DEPLOYMENT
// ==========================================
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// ১. পরিবেশ ভ্যারিয়েবল থেকে টোকেন নিন
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ ERROR: BOT_TOKEN পরিবেশ ভ্যারিয়েবল পাওয়া যায়নি! দয়া করে .env ফাইল বা Render এর Environment Variables এ BOT_TOKEN দিন।");
  process.exit(1);
}

// ২. টেলিগ্রাম বট ইনিশিয়ালাইজ করুন (Polling মোডে)
const bot = new TelegramBot(token, { polling: true });
console.log("🤖 টেলিগ্রাম বট পোলিং মোডে শুরু হচ্ছে...");

// ৩. Render এর জন্য Express HTTP সার্ভার
// (Render ফ্রি সার্ভিসের জন্য পোর্ট বাইন্ডিং ও হেলথ চেক রিকোয়ার্ড)
const app = express();
const PORT = process.env.PORT || ${config.port || 3000};

app.get('/', (req, res) => {
  res.send({
    status: 'online',
    message: '🤖 টেলিগ্রাম বট সফলভাবে চালু আছে এবং Render এ চলছে!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(\`🌐 Render Health Check সার্ভার পোর্ট \${PORT} এ চালু হয়েছে\`);
});

// ৪. /start কমান্ড হ্যান্ডলার
bot.onText(/\\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'বন্ধু';

  const welcomeText = \`👋 আসসালামু আলাইকুম, \${firstName}!\n\n${safeStartMessage.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏓 Ping টেস্ট', callback_data: 'ping_action' },
          { text: 'ℹ️ সাহায্য (Help)', callback_data: 'help_action' }
        ],
        [
          { text: '🌐 Render স্ট্যাটাস', callback_data: 'status_action' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeText, opts);
  console.log(\`[LOG] /start কমান্ড পেয়েছেন ইউজার: \${firstName} (ID: \${chatId})\`);
});

// ৫. /ping কমান্ড হ্যান্ডলার
${config.enablePing ? `bot.onText(/\\/ping/, (msg) => {
  const chatId = msg.chat.id;
  const startTime = Date.now();
  bot.sendMessage(chatId, '🏓 Pong! বট সচল আছে...').then(() => {
    const latency = Date.now() - startTime;
    bot.sendMessage(chatId, \`⚡ রেসপন্স টাইম: \${latency}ms\`);
  });
});` : ''}

// ৬. /help কমান্ড হ্যান্ডলার
bot.onText(/\\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = \`📖 সাহায্য মেনু:\n\n• /start - বট চালু করুন এবং ওয়েলকাম বার্তা দেখুন\n• /ping - বটের সক্রিয়তা ও পিং চেক করুন\n• /help - সকল কমান্ডের তালিকা দেখুন\n\nহোস্টিং: Render.com\nকন্ট্রোল: GitHub Repository\`;
  bot.sendMessage(chatId, helpText);
});

// ৭. ইনলাইন বাটন ক্লিকের হ্যান্ডলার (Callback Query)
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'ping_action') {
    bot.answerCallbackQuery(query.id, { text: 'বট পুরোপুরি একটিভ!' });
    bot.sendMessage(chatId, '🏓 Pong! বট চমৎকারভাবে কাজ করছে।');
  } else if (data === 'help_action') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, 'ℹ️ আপনি যেকোনো টেক্সট পাঠিয়ে বটের টেস্ট করতে পারেন।');
  } else if (data === 'status_action') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, '✅ Render Web Service: লাইভ ও সুরক্ষিত!');
  }
});

// ৮. টেক্সট মেসেজ রেসপন্স
${config.enableEcho ? `bot.on('message', (msg) => {
  // কমান্ড এড়িয়ে সাধারণ টেক্সট মেসেজে উত্তর দিবে
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, \`📩 আপনি পাঠিয়েছেন: "\${msg.text}"\n\n✅ বট সফলভাবে রিসিভ করেছে!\`);
  }
});` : ''}

// ৯. কোনো এরর হ্যান্ডলিং যাতে বট ক্র্যাশ না করে
bot.on('polling_error', (error) => {
  console.error('[POLLING ERROR]', error.code, error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
`;

    const packageJsonContent = `{
  "name": "${config.botName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'my-telegram-bot'}",
  "version": "1.0.0",
  "description": "Telegram bot for GitHub & Render hosting",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "bot": "node index.js"
  },
  "keywords": ["telegram", "bot", "render", "github"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "node-telegram-bot-api": "^0.66.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`;

    const startShContent = `#!/bin/bash
# ==========================================
# Telegram Bot Startup Script (Linux/Mac/Render)
# ==========================================
echo "🚀 ডিপেনডেন্সি চেক করা হচ্ছে..."
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "🤖 টেলিগ্রাম বট স্টার্ট হচ্ছে (node index.js)..."
node index.js
`;

    const startBatContent = `@echo off
:: ==========================================
:: Telegram Bot Startup Script (Windows)
:: ==========================================
echo 🚀 Checking dependencies...
if not exist "node_modules" (
  npm install
)

echo 🤖 Starting Telegram Bot (node index.js)...
node index.js
pause
`;

    const procfileContent = `web: node index.js
worker: node index.js
`;

    const envContent = `# টেলিগ্রাম বটের সিক্রেট টোকেন
BOT_TOKEN=${safeToken}

# Render এর পোর্ট (Render স্বয়ংক্রিয়ভাবে প্রদান করবে)
PORT=${config.port || 3000}
`;

    const envExampleContent = `# Render Environment Variables এ এই নাম দিয়ে ভ্যালু সেট করবেন:
BOT_TOKEN=your_telegram_bot_token_here
PORT=3000
`;

    const gitignoreContent = `# Dependency directory
node_modules/

# Environment files with sensitive credentials
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db
`;

    const renderYamlContent = `services:
  - type: web
    name: ${config.botName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'telegram-bot'}
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: BOT_TOKEN
        sync: false
      - key: PORT
        value: 3000
`;

    const readmeContent = `# ${config.botName || 'Telegram Bot'} (GitHub & Render Deployment Guide)

এই টেলিগ্রাম বটটি Render-এ 24/7 ফ্রিতে হোস্ট করার জন্য সম্পূর্ণ প্রস্তুত।

## 📁 ফাইল পরিচিতি:
- \`index.js\` - মূল বট কোড (এতে Express সার্ভার যুক্ত আছে যাতে Render-এ স্লিপ/ক্র্যাশ না করে)
- \`package.json\` - প্রজেক্ট ডিপেনডেন্সি ও স্টার্ট স্ক্রিপ্ট
- \`.env\` - আপনার টেলিগ্রাম বটের টোকেন ফাইল
- \`.gitignore\` - সিকিউরিটি ফাইল (GitHub-এ .env টোকেন আপলোড হওয়া আটকায়)
- \`render.yaml\` - Render এর অটোমেটিক কনফিগারেশন

---

## 🚀 গিটহাব এবং রেন্ডারে ডিপ্লয় করার সহজ ধাপ:

### ধাপ ১: GitHub এ রিপোজিটরি তৈরি করুন
1. [github.com](https://github.com) এ লগইন করে **"New Repository"** তে ক্লিক করুন।
2. রিপোজিটরির নাম দিন (যেমন: \`telegram-test-bot\`)।
3. **Public** নির্বাচন করুন।
4. **"Create repository"** বাটনে চাপ দিন।
5. ডাউনলোড করা ফাইলগুলো আপলোড করুন (Upload files এ ক্লিক করে \`index.js\`, \`package.json\`, \`.gitignore\`, \`README.md\` ড্র্যাগ করে টেনে এনে **Commit changes** দিন)।
   *(মনে রাখবেন: সিকিউরিটির জন্য \`.env\` ফাইল গিটহাবে আপলোড করবেন না, এটি Render-এ যোগ করতে হবে)*

### ধাপ ২: Render.com এ ডিপ্লয় করুন
1. [dashboard.render.com](https://dashboard.render.com) এ যান ও GitHub দিয়ে লগইন/সাইনআপ করুন।
2. **"+ New"** বাটনে ক্লিক করে **"Web Service"** সিলেক্ট করুন।
3. আপনার গিটহাব রিপোজিটরি (\`telegram-test-bot\`) সিলেক্ট করে **"Connect"** দিন।
4. নিচের সেটিংসগুলো দিন:
   - **Name:** \`telegram-test-bot\`
   - **Language:** \`Node\`
   - **Branch:** \`main\`
   - **Build Command:** \`npm install\`
   - **Start Command:** \`npm start\`
   - **Instance Type:** \`Free\`
5. নিচে স্ক্রল করে **"Environment Variables"** সেকশনে যান:
   - **Key:** \`BOT_TOKEN\`
   - **Value:** \`${safeToken}\`
   - **Key:** \`PORT\`
   - **Value:** \`3000\`
6. **"Deploy Web Service"** বাটনে ক্লিক করুন!

---

## 📱 টেস্ট করার নিয়ম:
1. Render-এ ডিপ্লয় সম্পন্ন হলে লগে \`🤖 টেলিগ্রাম বট পোলিং মোডে শুরু হচ্ছে...\` দেখতে পাবেন।
2. এবার টেলিগ্রাম অ্যাপে আপনার বটে যান।
3. **/start** লিখে মেসেজ পাঠান।
4. বট সাথে সাথে রিপ্লাই দিবে! 🎉
`;

    return [
      {
        name: 'index.js',
        language: 'javascript',
        description: 'মূল টেলিগ্রাম বট লজিক + Render এর জন্য Express Health Server',
        badge: 'Main Code',
        content: indexJsContent,
      },
      {
        name: 'package.json',
        language: 'json',
        description: 'Node.js প্যাকেজ কনফিগারেশন এবং "start": "node index.js" স্ক্রিপ্ট',
        badge: 'Start Script',
        content: packageJsonContent,
      },
      {
        name: 'start.sh',
        language: 'bash',
        description: 'Linux / macOS / Render এর জন্য এক ক্লিকে স্টার্ট করার শেল স্ক্রিপ্ট',
        badge: 'Start Script (Linux/Mac)',
        content: startShContent,
      },
      {
        name: 'start.bat',
        language: 'bat',
        description: 'Windows পিসিতে ডাবল-ক্লিকে সরাসরি বট চালু করার ব্যাচ ফাইল',
        badge: 'Start Script (Windows)',
        content: startBatContent,
      },
      {
        name: 'Procfile',
        language: 'plaintext',
        description: 'Render ও ক্লাউড সার্ভারের জন্য প্রসেস ডিরেক্টিভ ফাইল',
        badge: 'Cloud Process',
        content: procfileContent,
      },
      {
        name: '.env',
        language: 'plaintext',
        description: 'লোকাল এনভায়রনমেন্ট ফাইল (আপনার বটের টোকেনসহ প্রস্তুত)',
        badge: 'Secret',
        content: envContent,
      },
      {
        name: '.env.example',
        language: 'plaintext',
        description: 'নমুনা এনভায়রনমেন্ট ফাইল (GitHub এর জন্য টেমপ্লেট)',
        badge: 'Template',
        content: envExampleContent,
      },
      {
        name: '.gitignore',
        language: 'plaintext',
        description: 'টোকেন ও নোড মডিউল গিটহাবে যাওয়া আটকানোর সুরক্ষা ফাইল',
        badge: 'Security',
        content: gitignoreContent,
      },
      {
        name: 'render.yaml',
        language: 'yaml',
        description: 'Render ব্লুপ্রিন্ট কনফিগারেশন ফাইল',
        badge: 'Render Spec',
        content: renderYamlContent,
      },
      {
        name: 'README.md',
        language: 'markdown',
        description: 'বাংলা ও ইংরেজিতে সম্পূর্ণ গিটহাব ও রেন্ডার ডিপ্লয় গাইডলাইন',
        badge: 'Documentation',
        content: readmeContent,
      },
    ];
  }

  // Python Alternative
  const mainPyContent = `# ==========================================
# TELEGRAM BOT FOR GITHUB & RENDER (PYTHON)
# ==========================================
import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes

TOKEN = os.getenv("BOT_TOKEN", "${safeToken}")

# Render এর হেলথ চেক সার্ভার
class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"status": "online", "message": "Bot is alive!"}')

def run_health_server():
    port = int(os.getenv("PORT", ${config.port || 3000}))
    server = HTTPServer(('0.0.0.0', port), HealthHandler)
    print(f"🌐 Health server running on port {port}")
    server.serve_forever()

# /start হ্যান্ডলার
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.effective_user.first_name or "বন্ধু"
    keyboard = [
        [InlineKeyboardButton("🏓 Ping টেস্ট", callback_data="ping")],
        [InlineKeyboardButton("ℹ️ সাহায্য (Help)", callback_data="help")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = f"👋 আসসালামু আলাইকুম, {user_name}!\\n\\n${safeStartMessage.replace(/"/g, '\\"')}"
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)

# /ping হ্যান্ডলার
async def ping(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🏓 Pong! বট সচল আছে এবং Render এ চলছে।")

# বাটন ক্লিক হ্যান্ডলার
async def button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    if query.data == "ping":
        await query.message.reply_text("🏓 Pong! বট একটিভ আছে।")
    elif query.data == "help":
        await query.message.reply_text("📖 সাহায্য পেতে /start অথবা /ping টাইপ করুন।")

def main():
    if not TOKEN:
        print("❌ ERROR: BOT_TOKEN পাওয়া যায়নি!")
        return

    # ব্যাকগ্রাউন্ডে হেলথ চেক সার্ভার চালু
    thread = threading.Thread(target=run_health_server, daemon=True)
    thread.start()

    # টেলিগ্রাম বট অ্যাপ
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ping", ping))
    app.add_handler(CallbackQueryHandler(button_click))

    print("🤖 টেলিগ্রাম পাইথন বট শুরু হচ্ছে...")
    app.run_polling()

if __name__ == '__main__':
    main()
`;

  const requirementsTxt = `python-telegram-bot==21.10
python-dotenv==1.0.1
`;

  const procfile = `web: python main.py
`;

  const pythonStartSh = `#!/bin/bash
echo "🚀 ডিপেনডেন্সি ইন্সটল করা হচ্ছে..."
pip install -r requirements.txt
echo "🤖 পাইথন টেলিগ্রাম বট শুরু হচ্ছে..."
python main.py
`;

  const pythonStartBat = `@echo off
echo 🚀 Installing dependencies...
pip install -r requirements.txt
echo 🤖 Starting Telegram Bot...
python main.py
pause
`;

  return [
    {
      name: 'main.py',
      language: 'python',
      description: 'Python টেলিগ্রাম বট স্ক্রিপ্ট + থ্রেডেড হেলথ চেক সার্ভার',
      badge: 'Main Code',
      content: mainPyContent,
    },
    {
      name: 'requirements.txt',
      language: 'plaintext',
      description: 'পাইথন লাইব্রেরি ডিপেনডেন্সি ফাইল',
      badge: 'Dependencies',
      content: requirementsTxt,
    },
    {
      name: 'start.sh',
      language: 'bash',
      description: 'Linux/Mac এ পাইথন বট স্টার্ট করার শেল স্ক্রিপ্ট',
      badge: 'Start Script (Linux)',
      content: pythonStartSh,
    },
    {
      name: 'start.bat',
      language: 'bat',
      description: 'Windows এ পাইথন বট স্টার্ট করার ব্যাচ স্ক্রিপ্ট',
      badge: 'Start Script (Windows)',
      content: pythonStartBat,
    },
    {
      name: 'Procfile',
      language: 'plaintext',
      description: 'Render এর জন্য প্রসেস ফাইল',
      badge: 'Render Spec',
      content: procfile,
    },
    {
      name: '.env',
      language: 'plaintext',
      description: 'বটের টোকেন ফাইল',
      badge: 'Secret',
      content: `BOT_TOKEN=${safeToken}\nPORT=${config.port || 3000}\n`,
    },
    {
      name: '.gitignore',
      language: 'plaintext',
      description: 'পাইথন ক্যাশ ও .env সুরক্ষা ফাইল',
      badge: 'Security',
      content: `__pycache__/\n*.pyc\n.env\nvenv/\n`,
    },
  ];
}
