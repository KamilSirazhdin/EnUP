package models

import (
	"time"
	"github.com/google/uuid"
)

type Level struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string    `json:"name" gorm:"not null;uniqueIndex"` // A0, A1, A2, B1, B2, C1, C2
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Order       int       `json:"order" gorm:"not null"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	Topics []Topic `json:"topics,omitempty" gorm:"foreignKey:LevelID"`
}

type Topic struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	LevelID     uuid.UUID `json:"level_id" gorm:"type:uuid;not null"`
	Name        string    `json:"name" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Content     string    `json:"content"` // HTML content
	Order       int       `json:"order" gorm:"not null"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	Level      Level       `json:"level,omitempty"`
	Exercises  []Exercise  `json:"exercises,omitempty" gorm:"foreignKey:TopicID"`
	Progress   []UserProgress `json:"progress,omitempty" gorm:"foreignKey:TopicID"`
}

type Exercise struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TopicID     uuid.UUID `json:"topic_id" gorm:"type:uuid;not null"`
	Type        string    `json:"type" gorm:"not null"` // multiple_choice, fill_blank, translation, audio
	Question    string    `json:"question" gorm:"not null"`
	Options     []string  `json:"options" gorm:"type:jsonb"` // For multiple choice
	CorrectAnswer string  `json:"correct_answer" gorm:"not null"`
	Explanation string    `json:"explanation"`
	Points      int       `json:"points" gorm:"default:10"`
	Order       int       `json:"order" gorm:"not null"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	Topic Topic `json:"topic,omitempty"`
}

type ExerciseAttempt struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	ExerciseID  uuid.UUID `json:"exercise_id" gorm:"type:uuid;not null"`
	Answer      string    `json:"answer"`
	IsCorrect   bool      `json:"is_correct"`
	Score       int       `json:"score"`
	AttemptedAt time.Time `json:"attempted_at"`
	CreatedAt   time.Time `json:"created_at"`
	
	// Relations
	User     User     `json:"user,omitempty"`
	Exercise Exercise `json:"exercise,omitempty"`
}

