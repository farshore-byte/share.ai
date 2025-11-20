package config

import (
	"os"

	"gopkg.in/yaml.v2"
)

// Config 总配置结构
type Config struct {
	Mongo MongoConfig `yaml:"mongo"`
	S3    S3Config    `yaml:"s3"`
}

// MongoConfig MongoDB配置结构
type MongoConfig struct {
	URI        string `yaml:"uri"`
	Database   string `yaml:"database"`
	Collection string `yaml:"collection"`
}

// S3Config S3/MinIO配置结构
type S3Config struct {
	Endpoint  string `yaml:"endpoint"`
	Bucket    string `yaml:"bucket"`
	Region    string `yaml:"region"`
	AccessKey string `yaml:"access_key"`
	SecretKey string `yaml:"secret_key"`
	UseSSL    bool   `yaml:"use_ssl"`
}

// LoadConfig 加载配置文件
func LoadConfig(path string) (Config, error) {
	var cfg Config
	file, err := os.Open(path)
	if err != nil {
		return cfg, err
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&cfg); err != nil {
		return cfg, err
	}

	return cfg, nil
}
