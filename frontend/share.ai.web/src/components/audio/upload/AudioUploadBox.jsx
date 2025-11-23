import React, { useRef, useState } from "react";

const AudioUploadBox = ({
  audioFile,
  audioDuration,
  setAudioFile,
  setAudioDuration,
  setAudioValid,
  setFormData,
  uploadResult,
  setUploadResult,
}) => {
  const fileInputRef = useRef(null);
  const allowedFormats = [".mp3", ".wav", ".flac"];
  const [loadingDuration, setLoadingDuration] = useState(false);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedFormats.includes(ext)) {
      setAudioFile(null);
      setAudioDuration(null);
      setAudioValid(false);
      setUploadResult({ success: false, message: "不支持的文件格式 ❌" });
      return;
    }

    setAudioFile(file);
    setAudioValid(false); // 先标记为无效，等待时长加载完成
    setLoadingDuration(true);
    setUploadResult({ success: false, message: "正在解析音频时长..." });

    // 自动解析音频时长
    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.addEventListener("loadedmetadata", () => {
      const duration = parseFloat(audio.duration.toFixed(2)); // 数字类型
      setAudioDuration(duration);
      setFormData((prev) => ({ ...prev, name: file.name.replace(/\.[^.]+$/, ""), duration }));
      setAudioValid(true);
      setLoadingDuration(false);
      setUploadResult({ success: true, message: "文件有效 ✔️" });
    });
  };

  return (
    <div
      onClick={handleFileClick}
      className="relative flex flex-col items-center justify-center w-full max-w-2xl p-16 bg-gray-800 border border-gray-700 rounded-3xl cursor-pointer hover:border-blue-500 hover:shadow-xl transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-2v13" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={2} />
      </svg>

      <p className="text-gray-300 text-center text-xl mb-2">
        点击或拖拽上传音频
      </p>

      {audioFile && (
        <div className="text-gray-200 mt-2 text-center">
          <p>文件名: {audioFile.name}</p>
          {loadingDuration ? (
            <p>解析中...</p>
          ) : (
            <p>时长: {audioDuration} 秒</p>
          )}
        </div>
      )}

      <input
        type="file"
        accept=".mp3,.wav,.flac"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadResult && (
        <p className={`mt-4 text-center ${uploadResult.success ? "text-green-400" : "text-red-500"}`}>
          {uploadResult.message}
        </p>
      )}
    </div>
  );
};

export default AudioUploadBox;
