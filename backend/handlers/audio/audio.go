package audio

import (
	"net/http"
	"io"
	"fmt"
	"os"
	"strconv"
	"path/filepath"
	utils "share.ai/backend/utils"
	database "share.ai/backend/database"

	"github.com/gin-gonic/gin"
	models "share.ai/backend/models/voice"
	audioService "share.ai/backend/services/audio"
	"mime/multipart"
)

// 上传音频，返回Audio对象

type UploadAudioRequest struct {
	Name     string       `json:"name"`       // 音频名称

	Class    string       `json:"class"`      // 音频类别：男声/女声/其他

	Duration int          `json:"duration"`   // 音频时长（秒）

	Image    *multipart.FileHeader  `json:"image"`     // 封面文件

	Audio    *multipart.FileHeader     `json:"audio"`      // 音频文件

	Labels   []string `json:"labels"`    // 音频标签
}

// 辅助函数 将 multipart.FileHeader 保存成本地文件
func SaveMultipartFile(file *multipart.FileHeader, dir, filenameWithoutExt string) (string, error) {
	// 获取文件扩展名
	ext := filepath.Ext(file.Filename)

	// 构建完整路径
	localPath := filepath.Join(dir, filenameWithoutExt+ext)

	// 打开上传文件
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// 创建本地文件
	out, err := os.Create(localPath)
	if err != nil {
		return "", fmt.Errorf("failed to create local file: %w", err)
	}
	defer out.Close()

	// 复制内容
	if _, err := io.Copy(out, src); err != nil {
		return "", fmt.Errorf("failed to copy file content: %w", err)
	}

	return localPath, nil
}

// 上传 request
func UploadAudioHandler(c *gin.Context) {
	// 绑定文本参数
	var req UploadAudioRequest
	// 手动解析并赋值
	req.Name = c.PostForm("name")
	req.Class = c.PostForm("class")
	req.Duration, _ = strconv.Atoi(c.PostForm("duration"))

	req.Audio, _ = c.FormFile("audio")
	req.Image, _ = c.FormFile("image")
	// 解析标签参数
	req.Labels = c.PostFormArray("labels")
	

	id := utils.GenerateID()

	// ------------------------------
	// step 1: 上传音频到S3
	audioExt := filepath.Ext(req.Audio.Filename)
	audioKey := fmt.Sprintf("audios/%s%s", id, audioExt)

	// 保存到本地
	audioLocalPath, err := SaveMultipartFile(req.Audio, "/tmp/", id)
	if err != nil {
		utils.Fail(c, "save audio failed: "+err.Error())
		return
	}

	audioURL, err := database.UploadFileToS3(audioLocalPath, audioKey)
	if err != nil {
		utils.Fail(c, "upload audio failed: "+err.Error())
		return
	}

	// ------------------------------
	// step 2: 上传封面
	var coverURL string
	if req.Image != nil {
		coverKey := fmt.Sprintf("covers/%s.webp", id) 
		// 保存本地
		coverPath, err := SaveMultipartFile(req.Image, "/tmp/", id)
		if err != nil {
			utils.Fail(c, "save cover failed: "+err.Error())
			return
		}

		// 压缩转 webp
		coverPath = utils.CompressImage(coverPath, 80)

		coverURL, err = database.UploadFileToS3(coverPath, coverKey)
		if err != nil {
			utils.Fail(c, "upload cover failed: "+err.Error())
			return
		}
	}

	// ------------------------------
	// step 3: 构造 Audio 对象
	audio := models.Audio{
		ID:       id,
		Name:     req.Name,
		Class:    req.Class,
		Duration: req.Duration,
		Audio:    audioURL,
		Cover:    coverURL,
		Labels:   req.Labels,
		State:    1, // 新上传的音频可见
	}

	// ------------------------------
	// step 4: 保存数据库（走 service）
	err = audioService.UploadAudio(&audio)
	if err != nil {
		utils.Fail(c, "save database failed: "+err.Error())
		return
	}

	// ------------------------------
	utils.Success(c, audio)
}

func ListAudiosHandler(c *gin.Context) {
	audios, err := audioService.GetAllAudios()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get audio list: " + err.Error()})
		return
	}
	//fmt.Printf("handler audios: %v", audios)
	c.JSON(http.StatusOK, audios)
}


func GetAudioHandler(c *gin.Context) {
	id := c.Param("id")
	audio, err := audioService.GetAudioByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audio not found: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, audio)
}

// SearchAudioByTagHandler 根据标签搜索音频列表
func SearchAudioByTagHandler(c *gin.Context) {
	tagCategory := c.Query("category")
	tagValue := c.Query("value")
	if tagCategory == "" || tagValue == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required tag parameters (category/value)"})
		return
	}
	audios, err := audioService.SearchAudioByTag(tagCategory, tagValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search audio by tag: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, audios)
}

// GetAudioDetailsHandler 根据ID获取音频详情信息
func GetAudioDetailsHandler(c *gin.Context) {
	// 暂与GetAudioHandler逻辑一致，后续可扩展详情字段
	id := c.Param("id")
	audio, err := audioService.GetAudioByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audio not found: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, audio)
}

// GetAudioStatsHandler 根据ID获取音频下载量数据
func GetAudioStatsHandler(c *gin.Context) {
	id := c.Param("id")
	// 暂返回默认值，后续需在模型中添加DownloadCount字段并实现统计逻辑
	stats := gin.H{
		"audio_id":       id,
		"download_count": 0,
		"last_download":  nil,
	}
	c.JSON(http.StatusOK, stats)
}

// SoftDeleteAudioHandler 软删除音频（设置state为0）

type DeleteReq struct {
	ID string `json:"id"`
}

func SoftDeleteAudioHandler(c *gin.Context) {
	var req DeleteReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, "invalid request: "+err.Error())
		return
	}
	err := audioService.SoftDeleteAudio(req.ID)
	if err != nil {
		utils.Fail(c, "Failed to soft delete audio: " + err.Error())
		return
	}
	utils.Success(c, gin.H{"message": "Audio soft deleted successfully"})
}
