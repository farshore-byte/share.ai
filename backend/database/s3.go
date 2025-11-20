package database

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	awsCreds "github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/minio/minio-go/v7"
	minioCreds "github.com/minio/minio-go/v7/pkg/credentials"
	"os"
)

var S3Uploader *s3manager.Uploader
var S3Bucket string
var MinioClient *minio.Client

// ensureBucket 检查桶是否存在，不存在则创建并设置为公有
func ensureBucket(endpoint, region, accessKey, secretKey, bucket string, useSSL bool) error {
	ctx := context.Background()
	// 初始化MinIO客户端
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  minioCreds.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
		Region: region,
	})
	if err != nil {
		return fmt.Errorf("初始化MinIO客户端失败: %w", err)
	}
	MinioClient = client

	// 检查桶是否存在
	found, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return fmt.Errorf("检查桶失败: %w", err)
	}

	// 不存在则创建桶
	if !found {
		if err := client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{Region: region}); err != nil {
			return fmt.Errorf("创建桶失败: %w", err)
		}
		fmt.Printf("成功创建S3桶: %s\n", bucket)
	}

	// 设置桶为公有（允许获取对象）
	policy := fmt.Sprintf(`{
	  "Version": "2012-10-17",
	  "Statement": [
	    {
	      "Effect": "Allow",
	      "Principal": {"AWS": ["*"]},
	      "Action": ["s3:GetObject"],
	      "Resource": ["arn:aws:s3:::%s/*"]
	    }
	  ]
	}`, bucket)

	if err := client.SetBucketPolicy(ctx, bucket, policy); err != nil {
		fmt.Printf("⚠️ 设置桶策略失败（可忽略）: %v\n", err)
	}

	return nil
}

func InitS3(endpoint, region, accessKey, secretKey, bucket string, useSSL bool) {
	S3Bucket = bucket
	// 确保桶存在并配置
	if err := ensureBucket(endpoint, region, accessKey, secretKey, bucket, useSSL); err != nil {
		fmt.Printf("S3桶初始化失败: %v\n", err)
		return
	}
	// 初始化AWS S3上传器
	sess := session.Must(session.NewSession(&aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		S3ForcePathStyle: aws.Bool(true),
		Credentials:      awsCreds.NewStaticCredentials(accessKey, secretKey, ""),
		DisableSSL:       aws.Bool(!useSSL), // 适配config.yaml中UseSSL配置，false时禁用HTTPS
	}))
	S3Uploader = s3manager.NewUploader(sess)
}

// 上传文件到S3
func UploadFileToS3(localPath, key string) (string, error) {
	file, err := os.Open(localPath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	result, err := S3Uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(S3Bucket),
		Key:    aws.String(key),
		Body:   file,
	})
	if err != nil {
		return "", err
	}
	return result.Location, nil
}



