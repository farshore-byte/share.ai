import React from 'react';

const SectionDivider = ({ text }) => {
  return (
    <div className="flex items-center my-8">
      <div className="flex-grow border-t border-gray-600"></div>
      <span className="px-4 text-gray-400 text-sm font-medium">{text}</span>
      <div className="flex-grow border-t border-gray-600"></div>
    </div>
  );
};

export default SectionDivider;