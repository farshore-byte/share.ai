import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const AudioActionMenu = ({ isOpen, onToggle, id }) => {
  const handleDelete = async () => {
    try {
      // 打印一下id
      console.log("delete audio id:", id);
      //请求体
      console.log(JSON.stringify({ id }))
      const response = await fetch('http://localhost:7005/audio/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('删除失败');
      alert('删除成功');
      onToggle();
      window.location.reload();
    } catch (error) {
      alert(`删除失败: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="text-white/50 hover:text-white"
      >
        <FiMoreVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full text-left px-3 py-1 text-white hover:bg-white/20 rounded-md transition-colors"
          >
            删除音频
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioActionMenu;
