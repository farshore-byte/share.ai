package models

// AudioLabel 定义音频标签
type AudioLabel struct {
	Category string `json:"category"` // 标签类别，例如：音色/风格/情绪
	Value    string `json:"value"`    // 标签值，例如：沉稳、温和、缓慢
}

// Audio 音频存储单元 
// 11.19 新增 封面字段
type Audio struct {
	ID       string       `json:"id" bson:"_id"`   // 音频ID，唯一标识
	Name     string       `json:"name" bson:"name"`       // 音频名称
	Class    string       `json:"class" bson:"class"`     // 音频类别：男声/女声/其他
	Duration int          `json:"duration" bson:"duration"` // 音频时长（秒）

	Cover     string       `json:"cover" bson:"cover"`       // S3 封面图 URL

	Audio      string       `json:"audio" bson:"audio"`         // S3 audio URL
	Labels   []string `json:"labels" bson:"labels"`   // 音频标签
	State    int      `json:"state" bson:"state"`     // 状态：1可见，0删除（软删除）
}
