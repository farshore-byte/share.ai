import React, { useState } from "react";
import AudioUploadBox from "./AudioUploadBox";
import AudioUploadForm from "./AudioUploadForm";

const UploadAudioPage = ({ onBack }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioValid, setAudioValid] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [formData, setFormData] = useState({ name: "", class: "", labels: [], duration: 0 });
  const [uploadResult, setUploadResult] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const submitForm = async () => {
    if (!audioFile) return alert("请选择音频文件");
    if (!audioDuration) return alert("音频还未解析完成，请稍后重试");
    setFormSubmitting(true);
    try {
      const fd = new FormData();
      // 后盾需要的duration是int类型
      fd.append("duration", Math.round(audioDuration));
      fd.append("name", formData.name);
      fd.append("class", formData.class);
      fd.append("audio", audioFile);
      if (coverImage) fd.append("image", coverImage);
      formData.labels.forEach((label) => fd.append("labels", label));

      const res = await fetch("http://localhost:7005/audio/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok) {
        setUploadResult({ success: true, message: "上传成功 🎉" });
        setAudioFile(null);
        setAudioValid(false);
        setFormData({ name: "", class: "", labels: [], duration: 0 });
        setCoverImage(null);
        setAudioDuration(null);
      } else throw new Error(data.message || "上传失败");
    } catch (err) {
      setUploadResult({ success: false, message: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <button onClick={onBack} className="self-start mb-4 text-white text-2xl hover:text-gray-300 transition-colors">
        ←
      </button>

      <AudioUploadBox
        audioFile={audioFile}
        audioDuration={audioDuration}
        setAudioFile={setAudioFile}
        setAudioDuration={setAudioDuration}
        setAudioValid={setAudioValid}
        setFormData={setFormData}
        uploadResult={uploadResult}
        setUploadResult={setUploadResult}
      />

      {audioValid && (
        <AudioUploadForm
          audioFile={audioFile}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          formData={formData}
          setFormData={setFormData}
          onSubmit={submitForm}
          submitting={formSubmitting}
        />
      )}
    </div>
  );
};

export default UploadAudioPage;
