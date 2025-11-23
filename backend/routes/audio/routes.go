package audio

import (
	"github.com/gin-gonic/gin"
	audioHandlers "share.ai/backend/handlers/audio"
)

// RegisterRoutes 注册所有API路由
func RegisterRoutes(r *gin.Engine) {
	audio := r.Group("/audio")
	{
		audio.POST("/upload", audioHandlers.UploadAudioHandler)         // 上传音频
		audio.GET("/list", audioHandlers.ListAudiosHandler)             // 获取音频列表
		audio.GET("/:id", audioHandlers.GetAudioHandler)                // 根据ID获取音频(下载音频)
		audio.GET("/search", audioHandlers.SearchAudioByTagHandler)     // 根据标签搜索音频列表
		audio.GET("/:id/details", audioHandlers.GetAudioDetailsHandler) // 根据ID获取音频详情信息
		audio.GET("/:id/stats", audioHandlers.GetAudioStatsHandler)     // 根据ID获取音频下载量数据
		audio.POST("/delete", audioHandlers.SoftDeleteAudioHandler) // 软删除音频（body传入id）
	}
}
