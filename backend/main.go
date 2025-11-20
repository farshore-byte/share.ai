package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"share.ai/backend/config"
	"share.ai/backend/database"
	"share.ai/backend/routes/audio"
	"net/http"
)

func main() {
	// 加载配置文件（修正路径指向src下的config.yaml）
	cfg, err := config.LoadConfig("./config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化MongoDB
	database.InitMongo(cfg.Mongo.URI, cfg.Mongo.Database, cfg.Mongo.Collection)
	log.Println("MongoDB initialized successfully")

	// 初始化S3/MinIO（传入UseSSL配置适配HTTP连接）
	database.InitS3(
		cfg.S3.Endpoint,
		cfg.S3.Region,
		cfg.S3.AccessKey,
		cfg.S3.SecretKey,
		cfg.S3.Bucket,
		cfg.S3.UseSSL,
	)
	log.Println("S3/MinIO initialized successfully")

	// 创建Gin路由器
	r := gin.Default()

	// --- CORS中间件 ---
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // 或 "*" 允许所有域
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// 预检请求直接返回 200
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	})

	// 注册音频API路由
	audio.RegisterRoutes(r)

	// 启动服务器
	log.Println("Starting server on :7005")
	if err := r.Run(":7005"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
