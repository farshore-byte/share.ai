import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PublishAudio = ({ onUploadClick }) => {  // ← 接受父组件传入回调
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleUploadAudio = () => {
    setIsMenuOpen(false);
    if (onUploadClick) onUploadClick();   // ← 通知父组件切换页面
  };

  return (
    <div
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <motion.button
        whileHover={{ scale: 1.15, boxShadow: '0px 0px 15px rgba(0, 158, 255, 0.7)' }}
        onClick={onUploadClick}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
          color: 'white',
          fontSize: '32px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: '0.3s',
        }}
        aria-label="Publish new audio"
      >
        +
      </motion.button>

      {/* 展开菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '-10px',
              padding: '12px 18px',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '15px',
              minWidth: '140px',
              textAlign: 'center',
            }}
          >
            <motion.button
              onClick={handleUploadAudio}
              whileHover={{ color: '#00d1ff', scale: 1.05 }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                color: 'white',
              }}
            >
               上传音频
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublishAudio;
