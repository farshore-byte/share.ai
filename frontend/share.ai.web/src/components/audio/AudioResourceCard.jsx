import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiDownload, FiPlay, FiPause } from 'react-icons/fi';

const AudioResourceCard = ({ id, cover, name, class: type, labels = [], audio, duration }) => {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const playerRef = useRef();

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const audioEl = playerRef.current;
    if (!audioEl) return;
    playing ? audioEl.pause() : audioEl.play();
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
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <img
          src={cover}
          alt={name}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
        />
        <div className="absolute bottom-2 right-2 bg-white/10 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm border border-white/20">
          {formatDuration(duration)}
        </div>
      </div>

      {/* 标题 + 分类 */}
      <div className="flex justify-between items-start mt-3 gap-2">
        <div className="flex flex-col w-full">
          <h3 className="text-white font-semibold text-base leading-snug">
            {name || '未命名音频'}
          </h3>
          <span className="mt-1 text-xs px-2 py-1 bg-white/5 border border-white/15 text-violet-300 rounded-full w-fit">
            {type}
          </span>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 hover:text-white">
          <FiMoreVertical size={20} />
        </button>
      </div>


      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mt-2 min-h-[1.5rem]">
        {labels.length > 0 ? (
          labels.map((label, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full"
            >
              {label}
            </span>
          ))
        ) : (
          // 空占位，保证高度
          <div className="h-4"></div>
        )}
      </div>

      {/* 播放控制 */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={togglePlay}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white/90 backdrop-blur-sm"
        >
          {playing ? <FiPause size={18} /> : <FiPlay size={18} />}
        </button>

        <button
          onClick={() => window.open(audio, '_blank')}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white/90 backdrop-blur-sm"
        >
          <FiDownload size={18} />
        </button>

        <span className="text-xs text-white/40">{playing ? '播放中' : '已暂停'}</span>
      </div>

      <audio ref={playerRef} src={audio} style={{ display: 'none' }} />
    </div>
  );
};

export default AudioResourceCard;
