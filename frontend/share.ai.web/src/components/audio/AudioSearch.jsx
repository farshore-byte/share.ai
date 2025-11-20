import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const AudioSearch = ({ search, setSearch }) => {
  return (
    <div className="relative w-full md:w-2/3 lg:w-1/2 mx-auto mb-10">

      {/* 霓虹边框 + 玻璃背景 */}
      <div className="
        absolute inset-0 rounded-2xl
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl
        border border-white/20
        shadow-[0_0_20px_rgba(139,92,246,0.15)]
      "></div>

      {/* 搜索图标 */}
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-20"
      />

      {/* 输入框 */}
      <input
        type="text"
        placeholder="搜索音频名称、来源或标签..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          relative z-20 w-full py-3.5 pl-12 pr-12
          bg-transparent
          text-white placeholder-white/40
          focus:outline-none focus:ring-0
          rounded-2xl
          text-base
          transition-all
        "
      />

      {/* 清除按钮 */}
      {search && (
        <button
          onClick={() => setSearch('')}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-white/50 hover:text-white z-20
            transition
          "
        >
          <FiX size={20} />
        </button>
      )}
    </div>
  );
};

export default AudioSearch;
