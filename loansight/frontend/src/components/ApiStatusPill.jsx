import React, { useState, useEffect } from 'react';
import { getHealth, API_BASE_URL } from '../lib/api';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

export default function ApiStatusPill() {
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const data = await getHealth();
      if (data && data.status === 'ok') {
        setOnline(true);
      } else {
        setOnline(false);
      }
    } catch (err) {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => !online && setShowModal(!showModal)}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
          online
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100'
            : 'bg-rose-50 text-rose-800 border-rose-400 shadow-hard-sm animate-pulse cursor-pointer'
        }`}
        title={online ? 'FastAPI Backend connected on port 8001' : 'Backend offline. Click for details'}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full border border-black/20 ${
            online ? 'bg-risk-low' : 'bg-risk-high'
          }`}
        ></span>
        <span className="hidden sm:inline font-mono text-[11px] tracking-tight uppercase">
          {online ? 'API Online' : 'API Offline'}
        </span>
        {loading ? (
          <RefreshCw className="w-3 h-3 animate-spin opacity-75" />
        ) : online ? (
          <Wifi className="w-3.5 h-3.5 text-risk-low" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-risk-high" />
        )}
      </button>

      {/* Offline Details Dropdown Modal */}
      {!online && showModal && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl p-4 shadow-hard border-2 border-ink z-50 text-xs space-y-3">
          <div className="flex items-center gap-2 font-display font-bold text-risk-high text-sm">
            <AlertCircle className="w-4 h-4" />
            Backend Connection Failed
          </div>
          <p className="text-ink-muted leading-relaxed">
            Target URL: <code className="bg-canvas-subtle px-1.5 py-0.5 rounded font-mono text-[11px] text-ink font-semibold">{API_BASE_URL}</code>
          </p>
          <p className="text-ink-muted leading-relaxed">
            Ensure FastAPI backend is running via <code className="bg-canvas-subtle px-1 py-0.5 rounded font-mono font-semibold">run_backend.bat</code> on port 8001.
          </p>
          <button
            onClick={checkStatus}
            disabled={loading}
            className="w-full py-2 bg-risk-high hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors hard-shadow-sm border border-ink"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
}

