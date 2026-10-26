import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderArchive,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Server,
  Github,
  Send,
  Sparkles,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  Code2,
  BookOpen,
  Smartphone,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { getGeneratedFiles, BotConfig, GeneratedFile } from './botTemplates';

export default function App() {
  // Pre-fill user's provided token
  const [token, setToken] = useState('8223856553:AAFafIeF1ZHbtMt80GJDAKUl2ffah5TN6BA');
  const [showToken, setShowToken] = useState(false);
  const [botName, setBotName] = useState('telegram-test-bot');
  const [startMessage, setStartMessage] = useState(
    '👋 হ্যালো! আমি আপনার টেলিগ্রাম টেস্ট বট।\n\n🚀 বটটি সফলভাবে GitHub এবং Render এর মাধ্যমে হোস্ট করা হয়েছে!\n\nকমান্ডসমূহ:\n/start - এই বার্তা দেখার জন্য\n/ping - বট লাইভ কিনা টেস্ট করতে\n/help - সাহায্য মেনু'
  );
  const [enableEcho, setEnableEcho] = useState(true);
  const [enablePing, setEnablePing] = useState(true);
  const [language, setLanguage] = useState<'nodejs' | 'python'>('nodejs');
  const [activeTab, setActiveTab] = useState<'files' | 'guide' | 'simulator' | 'render-settings'>('files');
  const [selectedFileName, setSelectedFileName] = useState('index.js');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Telegram Simulator State
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; buttons?: string[] }>>([
    {
      sender: 'user',
      text: '/start',
      time: '12:00 PM',
    },
    {
      sender: 'bot',
      text: `👋 আসসালামু আলাইকুম, বন্ধু!\n\n${startMessage}`,
      time: '12:00 PM',
      buttons: ['🏓 Ping টেস্ট', 'ℹ️ সাহায্য (Help)', '🌐 Render স্ট্যাটাস']
    }
  ]);
  const [simInput, setSimInput] = useState('');

  const config: BotConfig = {
    token,
    botName,
    startMessage,
    enableEcho,
    enablePing,
    port: 3000
  };

  const files = getGeneratedFiles(config, language);
  const activeFile = files.find(f => f.name === selectedFileName) || files[0];

  // Copy code handler
  const handleCopy = (content: string, name: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2200);
  };

  // Download single file
  const handleDownloadSingle = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download All as ZIP using JSZip
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.name, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${botName || 'telegram-bot'}-${language}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Handle simulator message
  const handleSendSimMessage = (textToSend?: string) => {
    const text = textToSend || simInput;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgs = [...simMessages, { sender: 'user' as const, text, time }];

    let replyText = '';
    let buttons: string[] | undefined = undefined;

    if (text.toLowerCase() === '/start') {
      replyText = `👋 আসসালামু আলাইকুম, বন্ধু!\n\n${startMessage}`;
      buttons = ['🏓 Ping টেস্ট', 'ℹ️ সাহায্য (Help)', '🌐 Render স্ট্যাটাস'];
    } else if (text.toLowerCase() === '/ping' || text === '🏓 Ping টেস্ট') {
      replyText = `🏓 Pong! বট সক্রিয় আছে এবং Render এ চলছে।\n⚡ রেসপন্স টাইম: 42ms`;
    } else if (text.toLowerCase() === '/help' || text === 'ℹ️ সাহায্য (Help)') {
      replyText = `📖 সাহায্য মেনু:\n• /start - ওয়েলকাম বার্তা\n• /ping - সক্রিয়তা চেক\n• /help - নির্দেশিকা\n\nহোস্টিং: Render.com`;
    } else if (text === '🌐 Render স্ট্যাটাস') {
      replyText = `✅ Render Web Service: লাইভ ও সক্রিয়!\n🌐 Health Server: Port 3000 OK`;
    } else {
      replyText = enableEcho 
        ? `📩 আপনি পাঠিয়েছেন: "${text}"\n\n✅ বট সফলভাবে রিসিভ করেছে!`
        : `👋 মেসেজ পেয়েছি। কমান্ড দেখতে /help পাঠান।`;
    }

    setTimeout(() => {
      setSimMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          buttons
        }
      ]);
    }, 400);

    setSimMessages(newMsgs);
    setSimInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Warning & Status Header */}
      <div className="bg-amber-950/60 border-b border-amber-500/30 px-4 py-2.5 text-xs md:text-sm text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>অনুরোধ অনুসারে:</strong> আপনার বট টোকেন দিয়ে এই ব্রাউজার বা স্যান্ডবক্সে বট রান করা হচ্ছে না। সমস্ত ফাইল প্রস্তুত করা হয়েছে যাতে আপনি ডাউনলোড করে <strong>GitHub</strong> এবং <strong>Render</strong>-এ নিরাপদে হোস্ট করতে পারেন।
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
              <Send className="w-5 h-5 -rotate-12 translate-x-0.5 -translate-y-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight">Telegram Bot Exporter</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30">
                  Render + GitHub Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">GitHub রিপোজিটরি ও Render ফ্রি হোস্টিং প্যাকেজ জেনারেটর</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Language switch */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700/80 flex text-xs font-medium">
              <button
                onClick={() => {
                  setLanguage('nodejs');
                  setSelectedFileName('index.js');
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  language === 'nodejs'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Node.js (সুপারিশকৃত)
              </button>
              <button
                onClick={() => {
                  setLanguage('python');
                  setSelectedFileName('main.py');
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  language === 'python'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python
              </button>
            </div>

            {/* Download All ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>{isZipping ? 'জিপ তৈরি হচ্ছে...' : 'সব ফাইল জিপ (.zip) ডাউনলোড'}</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-slate-800/80 pt-1">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'files'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>প্রজেক্ট ফাইলসমূহ ({files.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>GitHub ও Render সেটআপ গাইড</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'simulator'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>লাইভ রেসপন্স প্রিভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('render-settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'render-settings'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Render কনফিগারেশন চেকলিস্ট</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {/* Token & Bot Quick Settings Bar */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Token Input */}
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  টেলিগ্রাম বট টোকেন (BOT_TOKEN)
                </label>
                <span className="text-[11px] text-slate-400">আপনার দেওয়া টোকেন ইনপুট করা হয়েছে</span>
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="8223856553:AAFafIeF1ZHbtMt80GJDAKUl2ffah5TN6BA"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs md:text-sm font-mono text-emerald-400 focus:outline-none focus:border-sky-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  title={showToken ? 'লুকান' : 'দেখুন'}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bot Name Input */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">রিপোজিটরি / বটের নাম</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="telegram-test-bot"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Quick switches */}
            <div className="md:col-span-3 flex flex-wrap gap-3 items-center justify-start md:justify-end pt-2 md:pt-0">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enablePing}
                  onChange={(e) => setEnablePing(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>/ping কমান্ড</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableEcho}
                  onChange={(e) => setEnableEcho(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>সাধারণ মেসেজে উত্তর</span>
              </label>
            </div>
          </div>
        </section>

        {/* Start Script Info Banner */}
        <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white text-sm">স্টার্ট স্ক্রিপ্ট (Start Scripts) প্রস্তুত রয়েছে:</strong>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  npm start (node index.js)
                </span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Render এ বট চালু করতে Start Command হিসেবে <code className="text-sky-300 font-mono bg-slate-900 px-1 py-0.5 rounded">npm start</code> স্বয়ংক্রিয়ভাবে <code className="text-emerald-400 font-mono">node index.js</code> চালাবে। এছাড়া সহজে চালানোর জন্য <button onClick={() => { setSelectedFileName('package.json'); setActiveTab('files'); }} className="text-sky-400 underline font-mono cursor-pointer">package.json</button>, <button onClick={() => { setSelectedFileName('start.sh'); setActiveTab('files'); }} className="text-sky-400 underline font-mono cursor-pointer">start.sh</button>, এবং Windows এর জন্য <button onClick={() => { setSelectedFileName('start.bat'); setActiveTab('files'); }} className="text-sky-400 underline font-mono cursor-pointer">start.bat</button> ফাইল যুক্ত আছে।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedFileName('package.json');
                setActiveTab('files');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              package.json স্ক্রিপ্ট দেখুন
            </button>
            <button
              onClick={() => {
                setSelectedFileName('start.sh');
                setActiveTab('files');
              }}
              className="px-3 py-1.5 bg-sky-600/90 hover:bg-sky-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              start.sh দেখুন
            </button>
          </div>
        </div>

        {/* TAB 1: FILES & CODE */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* File List / Sidebar */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-300">
                    ফাইলসমূহ ({files.length}টি ফাইল)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">ডাউনলোড করতে ক্লিক করুন</span>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-[520px] overflow-y-auto">
                {files.map((file) => {
                  const isSelected = selectedFileName === file.name;
                  return (
                    <div
                      key={file.name}
                      onClick={() => setSelectedFileName(file.name)}
                      className={`p-3 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-500/10 border-l-4 border-sky-500'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-semibold truncate ${
                            isSelected ? 'text-sky-300' : 'text-slate-200'
                          }`}>
                            {file.name}
                          </span>
                          {file.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              {file.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">
                          {file.description}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSingle(file);
                        }}
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-md transition-colors shrink-0"
                        title={`Download ${file.name}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick ZIP Banner */}
              <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">এক ক্লিকে সব ফাইল নিন:</span>
                <button
                  onClick={handleDownloadZip}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ZIP ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Code Preview & Actions */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-sky-300">{activeFile.name}</span>
                  <span className="text-xs text-slate-400">({activeFile.description})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeFile.content, activeFile.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedFile === activeFile.name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>কোড কপি করুন</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadSingle(activeFile)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>এই ফাইলটি ডাউনলোড করুন</span>
                  </button>
                </div>
              </div>

              {/* Code viewer */}
              <div className="relative bg-slate-950 p-4 overflow-x-auto max-h-[580px]">
                <pre className="font-mono text-xs md:text-sm text-slate-300 leading-relaxed">
                  <code>{activeFile.content}</code>
                </pre>
              </div>

              {/* Footer explanation */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>
                  ফাইল সাইজ: ~{Math.round(new Blob([activeFile.content]).size / 1024 * 10) / 10} KB • {activeFile.content.split('\n').length} লাইন
                </span>
                <span className="text-sky-400">Render Free Web Service উপযোগী</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED STEP-BY-STEP DEPLOYMENT GUIDE */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                GitHub-এ আপলোড ও Render-এ ফ্রিতে 24/7 ডিপ্লয় করার সহজ গাইড (বাংলায়)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                নিচের ৫টি সহজ ধাপ অনুসরণ করে ৫ মিনিটের মধ্যেই আপনার বট অনলাইনে নিয়ে আসুন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/30">
                    ১
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">ডাউনলোড ও আনজিপ</span>
                </div>
                <h3 className="font-bold text-white text-base">ফাইলগুলো আপনার কম্পিউটারে ডাউনলোড করুন</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  উপরে থাকা সবুজ <strong>"সব ফাইল জিপ (.zip) ডাউনলোড"</strong> বাটনে ক্লিক করে ফাইলগুলো ডাউনলোড করুন। জিপ ফাইলটি Extract / আনজিপ করলে আপনি <code className="text-sky-300 font-mono">index.js</code>, <code className="text-sky-300 font-mono">package.json</code>, <code className="text-sky-300 font-mono">.gitignore</code> ইত্যাদি ফাইলগুলো পাবেন।
                </p>
                <div className="mt-auto pt-2">
                  <button
                    onClick={handleDownloadZip}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>এখনই ZIP ডাউনলোড করুন</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                    ২
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">GitHub রিপোজিটরি</span>
                </div>
                <h3 className="font-bold text-white text-base">GitHub এ নতুন রিপোজিটরি তৈরি ও ফাইল আপলোড</h3>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li><a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">github.com/new</a> এ যান।</li>
                  <li>Repository name এ লিখুন: <code className="text-purple-300 font-mono">{botName}</code></li>
                  <li><strong>Public</strong> সিলেক্ট করে <strong>Create repository</strong> বাটনে চাপ দিন।</li>
                  <li>পেজে <strong>"uploading an existing file"</strong> লিংকে ক্লিক করুন।</li>
                  <li>আনজিপ করা ফাইলগুলো (বিশেষ করে <code className="text-sky-300">index.js</code>, <code className="text-sky-300">package.json</code>, <code className="text-sky-300">.gitignore</code>, <code className="text-sky-300">render.yaml</code>, <code className="text-sky-300">README.md</code>) টেনে এনে আপলোড করুন এবং <strong>Commit changes</strong> দিন।</li>
                </ol>
                <div className="bg-amber-950/40 border border-amber-500/20 rounded-lg p-2.5 text-[11px] text-amber-300 mt-2">
                  ⚠️ <strong>সতর্কতা:</strong> <code className="font-mono">.env</code> ফাইলটি গিটহাবে আপলোড করবেন না, যাতে আপনার বটের টোকেন কেউ দেখতে না পায়। টোকেনটি আমরা সরাসরি Render-এ সেট করব।
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    ৩
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Render এ কানেক্ট</span>
                </div>
                <h3 className="font-bold text-white text-base">Render.com এ Web Service তৈরি করুন</h3>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li><a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">dashboard.render.com</a> এ গিয়ে GitHub দিয়ে ফ্রি সাইন-আপ/লগইন করুন।</li>
                  <li>উপরে <strong>"+ New"</strong> বাটনে ক্লিক করে <strong>"Web Service"</strong> নির্বাচন করুন।</li>
                  <li>আপনার তৈরি করা গিটহাব রিপোজিটরি (<code className="text-emerald-300 font-mono">{botName}</code>) নির্বাচন করে <strong>"Connect"</strong> বাটনে ক্লিক করুন।</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                    ৪
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Render সেটিংস ও টোকেন</span>
                </div>
                <h3 className="font-bold text-white text-base">Build Command ও BOT_TOKEN সেট করা</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2 font-mono">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 font-sans">Language:</span>
                    <span className="text-sky-300">Node</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 font-sans">Build Command:</span>
                    <span className="text-emerald-300">npm install</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 font-sans">Start Command:</span>
                    <span className="text-emerald-300">npm start</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 font-sans">Instance Type:</span>
                    <span className="text-emerald-400 font-bold">Free</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 mt-1">
                  নিচে <strong>"Environment Variables"</strong> সেকশনে গিয়ে Add করুন:
                  <div className="bg-slate-900 border border-slate-800 rounded p-2 mt-1.5 font-mono text-[11px]">
                    <span className="text-amber-400">Key:</span> BOT_TOKEN<br />
                    <span className="text-emerald-400">Value:</span> {token}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  সবশেষে <strong>"Deploy Web Service"</strong> বাটনে চাপ দিন।
                </p>
              </div>
            </div>

            {/* Step 5 Testing */}
            <div className="bg-gradient-to-r from-sky-950/60 to-blue-950/60 border border-sky-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/30 font-bold">
                  ৫
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">বট টেস্ট করা (টেলিগ্রাম অ্যাপে)</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Render এ ডেপ্লয়মেন্ট সফল হলে লগ-এ <code className="text-emerald-300 font-mono">"🤖 টেলিগ্রাম বট পোলিং মোডে শুরু হচ্ছে..."</code> দেখতে পাবেন। এবার আপনার টেলিগ্রামে গিয়ে বটটিতে <strong className="text-white">/start</strong> মেসেজ পাঠান। বট তৎক্ষণাৎ আপনার দেওয়া স্বাগতম বার্তা ও বাটন দিয়ে উত্তর দিবে!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('simulator')}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>এখানে টেস্ট প্রিভিউ দেখুন</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left explanation & customizer */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-white text-sm">বট রেসপন্স টেস্ট ও এডিটর</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  আপনার ইউজাররা যখন টেলিগ্রামে <code className="text-sky-300">/start</code> পাঠাবে, বট ঠিক এই বার্তাই রিপ্লাই দিবে। আপনি চাইলে এখান থেকে মেসেজটি পরিবর্তন করে নিতে পারেন:
                </p>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-semibold text-slate-300">
                    /start ওয়েলকাম মেসেজ (কাস্টমাইজ করুন):
                  </label>
                  <textarea
                    rows={6}
                    value={startMessage}
                    onChange={(e) => setStartMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                    placeholder="আপনার ওয়েলকাম মেসেজ লিখুন..."
                  />
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  💡 <strong>টিপ:</strong> আপনি এখানে যাই লিখবেন, তা সরাসরি আপনার ডাউনলোডকৃত <code className="text-sky-400">index.js</code> ফাইলে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে!
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-400">
                  বটের উপলব্ধ কমান্ডসমূহ:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-sky-300 font-semibold">/start</span>
                    <span className="text-slate-400">ওয়েলকাম বার্তা ও বাটন</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-sky-300 font-semibold">/ping</span>
                    <span className="text-slate-400">বটের রেসপন্স টাইম চেক</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-sky-300 font-semibold">/help</span>
                    <span className="text-slate-400">সাহায্য মেনু ও তথ্য</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Phone Simulator */}
            <div className="md:col-span-7 flex justify-center">
              <div className="w-full max-w-md bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[620px]">
                {/* Phone Speaker Notch */}
                <div className="bg-slate-900 pt-3 pb-2 flex justify-center items-center">
                  <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
                  </div>
                </div>

                {/* Telegram App Header */}
                <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                      🤖
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-white">{botName}</h4>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        bot (online)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSimMessages([
                        {
                          sender: 'user',
                          text: '/start',
                          time: '12:00 PM'
                        },
                        {
                          sender: 'bot',
                          text: `👋 আসসালামু আলাইকুম, বন্ধু!\n\n${startMessage}`,
                          time: '12:00 PM',
                          buttons: ['🏓 Ping টেস্ট', 'ℹ️ সাহায্য (Help)', '🌐 Render স্ট্যাটাস']
                        }
                      ]);
                    }}
                    className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    রিসেট
                  </button>
                </div>

                {/* Chat Message Flow */}
                <div className="flex-1 bg-slate-950/90 p-4 overflow-y-auto space-y-3 flex flex-col">
                  <div className="text-center my-1">
                    <span className="text-[10px] bg-slate-800/80 text-slate-400 px-2.5 py-0.5 rounded-full">
                      আজ
                    </span>
                  </div>

                  {simMessages.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={index}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
                          isUser ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm whitespace-pre-wrap leading-relaxed ${
                            isUser
                              ? 'bg-sky-600 text-white rounded-tr-none'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                          <div
                            className={`text-[9px] mt-1 text-right ${
                              isUser ? 'text-sky-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.time}
                          </div>
                        </div>

                        {/* Inline Buttons if available */}
                        {msg.buttons && (
                          <div className="grid grid-cols-2 gap-1.5 mt-2 w-full">
                            {msg.buttons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                onClick={() => handleSendSimMessage(btn)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-sky-600 hover:text-white border border-slate-700 text-slate-300 text-[11px] rounded-lg text-center transition-colors shadow-sm cursor-pointer"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick command buttons */}
                <div className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 flex gap-2 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => handleSendSimMessage('/start')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-md shrink-0 transition-colors cursor-pointer"
                  >
                    /start
                  </button>
                  <button
                    onClick={() => handleSendSimMessage('/ping')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-md shrink-0 transition-colors cursor-pointer"
                  >
                    /ping
                  </button>
                  <button
                    onClick={() => handleSendSimMessage('/help')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-md shrink-0 transition-colors cursor-pointer"
                  >
                    /help
                  </button>
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendSimMessage();
                  }}
                  className="bg-slate-900 p-2.5 border-t border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="মেসেজ লিখুন..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 -rotate-12" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RENDER CONFIG REFERENCE */}
        {activeTab === 'render-settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Render Web Service কনফিগারেশন চেকলিস্ট
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Render এ ডিপ্লয় করার সময় নিচের মানগুলো কপি করে পেস্ট করুন:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Service Type
                  </span>
                  <p className="text-base font-bold text-white mt-1">Web Service</p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Render-এর Free প্ল্যানে Web Service সম্পূর্ণ ফ্রি। আমাদের কোডে পোর্ট বাইন্ডিং ও হেলথ চেক রাখা হয়েছে।)
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Environment (Language)
                  </span>
                  <p className="text-base font-bold text-sky-400 mt-1">
                    {language === 'nodejs' ? 'Node' : 'Python 3'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Node.js 18+ বা Python এর জন্য স্বয়ংক্রিয়ভাবে সনাক্ত হবে।
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Build Command
                    </span>
                    <button
                      onClick={() => handleCopy(language === 'nodejs' ? 'npm install' : 'pip install -r requirements.txt', 'build-cmd')}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFile === 'build-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>কপি</span>
                    </button>
                  </div>
                  <p className="text-sm font-mono text-emerald-400 mt-1 bg-slate-900 p-2 rounded border border-slate-800">
                    {language === 'nodejs' ? 'npm install' : 'pip install -r requirements.txt'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Start Command
                    </span>
                    <button
                      onClick={() => handleCopy(language === 'nodejs' ? 'npm start' : 'python main.py', 'start-cmd')}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFile === 'start-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>কপি</span>
                    </button>
                  </div>
                  <p className="text-sm font-mono text-emerald-400 mt-1 bg-slate-900 p-2 rounded border border-slate-800">
                    {language === 'nodejs' ? 'npm start' : 'python main.py'}
                  </p>
                </div>
              </div>
            </div>

            {/* Environment Variables Table */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Render Environment Variables (অবশ্যই যোগ করবেন)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Key (নাম)</th>
                      <th className="py-2.5 px-3">Value (মান)</th>
                      <th className="py-2.5 px-3">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-amber-300">BOT_TOKEN</td>
                      <td className="py-2.5 px-3 text-emerald-400 truncate max-w-xs">{token}</td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => handleCopy(token, 'token-val')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedFile === 'token-val' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          কপি টোকেন
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-amber-300">PORT</td>
                      <td className="py-2.5 px-3 text-slate-300">3000</td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => handleCopy('3000', 'port-val')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedFile === 'port-val' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          কপি
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Free Tier Sleep Prevention Tip */}
            <div className="bg-sky-950/40 border border-sky-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-white">Render Free Tier 24/7 সচল রাখার উপায় (Keep-Alive):</strong>
                <p>
                  Render এর ফ্রি প্ল্যানে ১৫ মিনিট কোনো রিকোয়েস্ট না আসলে সার্ভিস সাময়িক স্লিপ মোডে যেতে পারে। আপনার তৈরি করা বটে ইতিমধ্যেই একটি <code className="text-sky-300 font-mono">/health</code> রুট দেওয়া আছে। আপনি <a href="https://cron-job.org" target="_blank" rel="noreferrer" className="text-sky-400 underline">cron-job.org</a> অথবা <a href="https://uptimerobot.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">UptimeRobot</a> এ আপনার Render এর URL টি প্রতি ১০ মিনিট অন্তর পিং করিয়ে রাখলে বট কখনই স্লিপ করবে না এবং সর্বদা অনলাইনে থাকবে!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          Telegram Bot Creator & Render Deployment Package • নিরাপদে ডাউনলোড করুন এবং GitHub এ পুশ করুন।
        </p>
      </footer>
    </div>
  );
}
