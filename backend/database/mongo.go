package database

import (
	"context"
	"log"
	"time"

	models "share.ai/backend/models/voice"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var AudioCollection *mongo.Collection

func InitMongo(uri, dbName, collectionName string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	MongoClient = client
	AudioCollection = client.Database(dbName).Collection(collectionName)
}

/***************************
 * 插入音频
***************************/
func InsertAudio(audio *models.Audio) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := AudioCollection.InsertOne(ctx, audio)
	return err
}

/***************************
 * 查询全部音频
***************************/
func GetAllAudios() ([]*models.Audio, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := AudioCollection.Find(ctx, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var audios []*models.Audio
	for cursor.Next(ctx) {
		var audio models.Audio
		if err := cursor.Decode(&audio); err != nil {
			continue
		}
		audios = append(audios, &audio)
	}
	return audios, nil
}

/***************************
 * 根据标签搜索音频
***************************/
func SearchAudioByTag(category, value string) ([]*models.Audio, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := map[string]interface{}{
		"labels": map[string]interface{}{
			"$elemMatch": map[string]interface{}{
				"category": category,
				"value":    value,
			},
		},
	}

	cursor, err := AudioCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var audios []*models.Audio
	for cursor.Next(ctx) {
		var audio models.Audio
		if err := cursor.Decode(&audio); err != nil {
			continue
		}
		audios = append(audios, &audio)
	}
	return audios, nil
}

/***************************
 * 根据 ID 查询音频
***************************/
func GetAudioByID(id string) (*models.Audio, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var audio models.Audio
	err := AudioCollection.FindOne(ctx, map[string]interface{}{
		"_id": id,
	}).Decode(&audio)

	if err != nil {
		return nil, err
	}

	return &audio, nil
}
