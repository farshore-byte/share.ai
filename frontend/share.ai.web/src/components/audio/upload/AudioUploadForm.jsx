import React, { useRef, useState } from "react";

const AudioUploadForm = ({ audioFile, coverImage, setCoverImage, formData, setFormData, onSubmit, submitting }) => {
  const imageInputRef = useRef(null);
  const [tagInput, setTagInput] = useState("");

  // 修改表单字段
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 标签输入回车生成标签
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.labels.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, labels: [...prev.labels, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, labels: prev.labels.filter((t) => t !== tag) }));
  };

  // 封面图片选择
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(file);
  };

  return (
    <div className="w-full max-w-2xl mt-8 p-8 bg-gray-800 border border-gray-700 rounded-3xl space-y-6">
      {/* 标题 */}
      <div className="flex flex-col">
        <label className="text-gray-300 mb-2">
          <span className="text-red-500 mr-1">*</span>标题
        </label>
        <input
          type="text"
          name="name"
          placeholder="请输入音频标题"
          value={formData.name}
          onChange={handleFormChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />
      </div>

      {/* 音色 */}
      <div className="flex flex-col">
        <label className="text-gray-300 mb-2">
          <span className="text-red-500 mr-1">*</span>音色
        </label>
        <select
          name="class"
          value={formData.class}
          onChange={handleFormChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>请选择音色</option>
          <option value="女声">女声</option>
          <option value="男声">男声</option>
          <option value="其他">其他</option>
        </select>
      </div>

      {/* 标签 */}
      <div className="flex flex-col">
        <label className="text-gray-300 mb-2">标签</label>
        <div className="flex flex-wrap items-center gap-2">
          {formData.labels.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-gray-200 hover:text-red-400">×</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="输入标签，回车确认"
            className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* 封面上传 */}
      <div className="flex flex-col">
        <label className="text-gray-300 mb-2">封面图片</label>
        <div
          onClick={() => imageInputRef.current?.click()}
          className="flex items-center justify-center w-full h-40 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500"
        >
          {coverImage ? (
            <img src={URL.createObjectURL(coverImage)} alt="封面" className="h-full object-contain" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h10a4 4 0 010 8H7a4 4 0 01-4-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* 提交 */}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className={`w-full py-4 mt-2 rounded-2xl font-medium transition-colors text-lg ${
          submitting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {submitting ? "提交中..." : "发布"}
      </button>
    </div>
  );
};

export default AudioUploadForm;
