import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Loader2, Sparkles, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateMinutes = async () => {
    setIsLoading(true);
    setMinutes('');
    try {
      const response = await fetch('/api/generate-minutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });
      const data = await response.json();
      if (response.ok) {
        setMinutes(data.minutes);
      } else {
        alert(data.error || '發生錯誤');
      }
    } catch (error) {
      console.error(error);
      alert('無法連接到伺服器');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minutes);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            會議記錄生成器
          </h1>
          <p className="text-lg text-white/80">快速將詳細逐字稿整理為重點會議紀要</p>
        </header>

        <section className="bg-white/10 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-2xl space-y-4">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="請在此貼上會議逐字稿..."
            className="w-full h-64 p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
          />
          <button
            onClick={generateMinutes}
            disabled={isLoading || !transcript.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 disabled:bg-gray-400/30 transition"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {isLoading ? '生成中...' : '生成總結與翻譯'}
          </button>
        </section>

        {minutes && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-white/50 space-y-4 text-slate-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">會議紀要</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-indigo-700 hover:text-indigo-900 transition"
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
                {isCopied ? '已複製' : '複製'}
              </button>
            </div>
            <div className="text-sm leading-relaxed space-y-2 prose prose-slate max-w-none">
              <ReactMarkdown>{minutes}</ReactMarkdown>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
