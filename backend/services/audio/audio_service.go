package audio

import (
	database "share.ai/backend/database"
	models "share.ai/backend/models/voice"
)



func UploadAudio(audio *models.Audio) error  {

	// step 4: 保存到数据库
	if err := database.InsertAudio(audio); err != nil {
		return err
	}

	return nil
}

func GetAllAudios() ([]*models.Audio, error) {
	return database.GetAllAudios()
}

func GetAudioByID(id string) (*models.Audio, error) {
	return database.GetAudioByID(id)
}

func SearchAudioByTag(category, value string) ([]*models.Audio, error) {
	return database.SearchAudioByTag(category, value)
}

// SoftDeleteAudio 更新音频状态为0（软删除）
func SoftDeleteAudio(id string) error {
	return database.UpdateAudioState(id, 0)
}
