import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiPlay, FiPause } from 'react-icons/fi';
import AudioActionMenu from './AudioActionMenu';

const AudioResourceCard = ({ id, cover, name, category, labels = [], audio, duration }) => {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const playerRef = useRef();

  // 格式化时长
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const audioEl = playerRef.current;
    if (!audioEl) return;
    if (playing) {
      audioEl.pause();
    } else {
      audioEl.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audioEl = playerRef.current;
    if (!audioEl) return;
    const handleEnded = () => setPlaying(false);
    audioEl.addEventListener('ended', handleEnded);
    return () => audioEl.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div
      className="bg-white/5 hover:bg-white/10 transition-all duration-300 
                 rounded-xl p-4 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]
                 backdrop-blur-md flex flex-col"
    >
      {/* 封面 + 时长 */}
      <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
        {cover ? (
          <img
            src={cover}
            alt={name}
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7M3 7l9 6 9-6" />
          </svg>
        )}

        {/* 播放时发光边框 */}
        {playing && (
          <div className="absolute inset-0 animate-pulse border-2 border-blue-400/60 rounded-lg pointer-events-none" />
        )}

        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-md 
                        backdrop-blur-sm border border-white/20">
          {formatDuration(duration)}
        </div>
      </div>
      {/* 标题 + 分类 */}
      <div className="flex justify-between items-start mt-3 gap-2">
        <div className="flex flex-col w-full">
          <h3 className="text-white font-semibold text-base leading-snug">
            {name || '未命名音频'}
          </h3>
          <span className="mt-1 text-xs px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-full w-fit">
            {category || "未分类"}
          </span>
        </div>

        <AudioActionMenu
          isOpen={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
          id={id}
        />
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mt-2 min-h-[1.5rem]">
        {labels.length > 0 ? (
          labels.map((label, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-white/10 border border-white/20 text-white/70 rounded-full"
            >
              #{label}
            </span>
          ))
        ) : (
          <div className="h-4" /> // 空占位
        )}
      </div>

      {/* 播放控制 */}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={togglePlay}
          className={`p-3 border rounded-full text-white/90 backdrop-blur-sm transition-all
            ${playing ? "bg-blue-500/30 border-blue-400 shadow-[0_0_12px_rgba(50,150,255,0.6)]" 
                       : "bg-white/5 hover:bg-white/10 border-white/20"}`}
        >
          {playing ? <FiPause size={18} /> : <FiPlay size={18} />}
        </button>

        <button
          type="button"
          onClick={() => window.open(audio, '_blank')}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white/90 backdrop-blur-sm"
        >
          <FiDownload size={18} />
        </button>

        <span className="text-xs text-white/40">
          {playing ? '播放中' : '已暂停'}
        </span>
      </div>

      <audio ref={playerRef} src={audio} style={{ display: 'none' }} />
    </div>
  );
};

export default AudioResourceCard;
