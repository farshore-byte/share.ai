package utils

import
(
	"github.com/google/uuid"
	"os"
	"path/filepath"
	"strings"
	"image"
	"fmt"
	"github.com/chai2010/webp"
)

// 生成唯一ID
func GenerateID() string {
	return uuid.New().String()
}


// CompressImage 压缩图片并转换成 webp
// path: 本地原始图片路径
// quality: 压缩质量 1~100
// 返回新生成的 webp 文件路径
func CompressImage(path string, quality int) string {
	// 打开原始文件
	file, err := os.Open(path)
	if err != nil {
		fmt.Println("failed to open image:", err)
		return path
	}
	defer file.Close()

	// 解码图片
	img, format, err := image.Decode(file)
	if err != nil {
		fmt.Println("failed to decode image:", err)
		return path
	}

	// 构建新的 webp 文件路径
	ext := filepath.Ext(path)
	base := strings.TrimSuffix(filepath.Base(path), ext)
	newPath := filepath.Join(os.TempDir(), base+".webp")

	out, err := os.Create(newPath)
	if err != nil {
		fmt.Println("failed to create webp file:", err)
		return path
	}
	defer out.Close()

	// 将图片编码成 webp
	var opts *webp.Options
	if quality < 1 || quality > 100 {
		quality = 80
	}
	opts = &webp.Options{Lossless: false, Quality: float32(quality)}

	err = webp.Encode(out, img, opts)
	if err != nil {
		fmt.Println("failed to encode webp:", err)
		return path
	}

	fmt.Printf("Compressed %s (%s) -> %s\n", path, format, newPath)
	return newPath
}