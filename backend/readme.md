# Audio Backend Service (MongoDB + S3/MinIO Integration)

## Overview
This backend service replaces pseudo-logic with real MongoDB data storage and S3/MinIO file management to provide fully functional audio management APIs.

## Configuration (config.yaml)
```yaml
mongo:
  uri: "mongodb://localhost:27017"
  database: "hug_db"
  collection: "audios"

s3:
  endpoint: "127.0.0.1:9000"      # MinIO service address
  bucket: "hug"                   # Auto-created on server start
  region: "us-east-1"             # MinIO default region
  access_key: "minioadmin"        # Default MinIO credentials
  secret_key: "minioadmin"
  use_ssl: false                  # Disabled for local environment

tmp_dir: "/tmp"                  # Temporarily hardcoded to ./uploads in handlers (to be synced with config)
```

## Core Features
- Auto-creation of S3/MinIO bucket (with public read access)
- Audio file upload to S3/MinIO + metadata storage in MongoDB
- Audio list query
- Audio detail query by ID
- Audio search by tag
- Basic audio stats (pending DownloadCount field implementation)

## API Endpoints
| Method | Path                | Parameters                                                                 | Description                  |
|--------|---------------------|-----------------------------------------------------------------------------|------------------------------|
| POST   | /audio/upload       | file (WAV/MP3), name, class, duration (int), labels (format: category:value) | Upload audio file and metadata |
| GET    | /audio/list         | None                                                                       | Get all audio metadata       |
| GET    | /audio/:id          | id (audio ID)                                                              | Get single audio metadata    |
| GET    | /audio/search       | category, value                                                             | Search audio by tag          |
| GET    | /audio/:id/details  | id (audio ID)                                                              | Get audio details (same as /audio/:id for now) |
| GET    | /audio/:id/stats    | id (audio ID)                                                              | Get audio download stats     |

## Setup Instructions
1. Install dependencies:
   ```bash
   cd share.ai/backend
   go mod tidy
   go mod vendor
   ```
2. Start MongoDB and MinIO services locally
3. Run the backend server:
   ```bash
   cd share.ai/backend
   go run main.go
   ```
4. Test upload endpoint (example):
   ```bash
   curl -X POST -F "file=@/Users/farshore/seven_project/share.ai/test/qyrqdf.wav" -F "name=test-audio" -F "class=sample" -F "duration=10" -F "labels=category:test,type:audio" http://localhost:7005/audio/upload
   ```
5. Test list endpoint:
   ```bash
   curl http://localhost:7005/audio/list
   ```

## Pending Improvements
- Sync tmpDir in handlers with config.yaml (add TmpDir field to config.Config struct)
- Implement audio download functionality in /audio/:id endpoint
- Add DownloadCount field to audio model and update stats logic
- Add audio deletion API endpoint
- Fix label parsing logic (current implementation uses filepath.SplitList incorrectly)
