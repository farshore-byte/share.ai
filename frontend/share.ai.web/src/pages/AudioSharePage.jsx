import React, { useState, useEffect } from "react";
import { FaBox } from "react-icons/fa";
import AudioResourceCard from "../components/audio/AudioResourceCard";
import AudioSearch from "../components/audio/AudioSearch";
import SectionDivider from "../components/audio/SectionDivider";
import PublishAudio from "../components/audio/PublishAudio";
import UploadAudioPage from "../components/audio/upload/UploadAudioPage";

const AudioSharePage = () => {
  const [search, setSearch] = useState("");
  const [audioList, setAudioList] = useState([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("list");

  // 获取音频列表
  useEffect(() => {
    const fetchAudioList = async () => {
      try {
        const response = await fetch("http://localhost:7005/audio/list");
        const data = await response.json();

        const transformedList = data.map((item) => ({
          id: item.id,
          cover: item.cover || "",
          name: item.name || "未命名音频",
          category: item.class || "未分类", 
          labels: item.labels || [],
          audio: item.audio || "",
          duration: item.duration || 0,
        }));

        setAudioList(transformedList);
      } catch (error) {
        const errorMsg = error.message.includes("CORS")
          ? "获取音频列表失败：跨域资源访问限制，请检查后端CORS配置"
          : "获取音频列表失败，请稍后重试";
        console.error(errorMsg, error);
        setError(errorMsg);
      }
    };

    fetchAudioList();
  }, []);

  // 搜索过滤
  const filteredAudioList = audioList.filter((audio) => {
    const name = audio.name?.toLowerCase() || "";
    const type = audio.class?.toLowerCase() || "";
    const keyword = search.toLowerCase();
    return name.includes(keyword) || type.includes(keyword);
  });

  return (
    <div className="w-full px-4 md:px-8 py-12 bg-gray-900 min-h-screen">
      {/* ================== 列表界面 ================== */}
      {mode === "list" && (
        <>
          {/* 搜索区域 */}
          <div className="mb-6">
            <AudioSearch search={search} setSearch={setSearch} />
          </div>

          <SectionDivider text="最近上新" />

          {/* 音频网格与状态展示 */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-500">
              <FaBox size={64} className="mb-4" />
              <p className="text-xl">{error}</p>
            </div>
          ) : filteredAudioList.length > 0 ? (
            <div
              className="grid gap-6 w-full"
              style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
              {filteredAudioList.map((audio, index) => (
                <AudioResourceCard key={index} {...audio} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FaBox size={64} className="mb-4" />
              <p className="text-xl">这里什么也没有</p>
            </div>
          )}

          {/* 固定上传按钮 */}
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 1000,
            }}
          >
            <PublishAudio onUploadClick={() => setMode("upload")} />
          </div>
        </>
      )}

      {/* ================== 上传音频页面 ================== */}
      {mode === "upload" && (
        <UploadAudioPage onBack={() => setMode("list")} />
      )}
    </div>
  );
};

export default AudioSharePage;
