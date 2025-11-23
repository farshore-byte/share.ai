package database

import (
	"context"
	"log"
	"time"

	models "share.ai/backend/models/voice"
	"fmt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"

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

	// 自动生成 ID
	if audio.ID == "" {
		audio.ID = uuid.New().String()
	}

	// 默认启用
	if audio.State == 0 {
		audio.State = 1
	}

	_, err := AudioCollection.InsertOne(ctx, audio)
	return err
}
/***************************
 * 查询全部音频
***************************/
func GetAllAudios() ([]*models.Audio, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := AudioCollection.Find(ctx, bson.M{"state": 1})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)


	// 防止nil指针，即使为空，至少为空列表
	audios := []*models.Audio{}
	for cursor.Next(ctx) {
		var audio models.Audio
		if err := cursor.Decode(&audio); err == nil {
			audios = append(audios, &audio)
		}
	}

	return audios, nil
}

/***************************
 * 根据标签搜索音频
***************************/
func SearchAudioByTag(category, value string) ([]*models.Audio, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"labels": bson.M{
			"$elemMatch": bson.M{
				"category": category,
				"value":    value,
			},
		},
		"state": 1,
	}

	cursor, err := AudioCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var audios []*models.Audio
	for cursor.Next(ctx) {
		var audio models.Audio
		if err := cursor.Decode(&audio); err == nil {
			audios = append(audios, &audio)
		}
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
	err := AudioCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&audio)
	if err != nil {
		return nil, err
	}

	return &audio, nil
}

// UpdateAudioState 更新音频状态（软删除）
func UpdateAudioState(id string, state int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := AudioCollection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"state": state}},
	)

	fmt.Printf("UpdateAudioState id=%s matched=%d modified=%d err=%v\n",
		id, res.MatchedCount, res.ModifiedCount, err,
	)

	return err
}