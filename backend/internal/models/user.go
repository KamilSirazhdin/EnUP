package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Name      string         `json:"name" gorm:"not null"`
	Avatar    *string        `json:"avatar"`
	Level     string         `json:"level" gorm:"default:'A0'"`
	Points    int            `json:"points" gorm:"default:0"`
	IsAdmin   bool           `json:"is_admin" gorm:"default:false"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	Progress     []UserProgress `json:"progress,omitempty" gorm:"foreignKey:UserID"`
	Achievements []Achievement  `json:"achievements,omitempty" gorm:"many2many:user_achievements;"`
}

type UserProgress struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	TopicID     uuid.UUID  `json:"topic_id" gorm:"type:uuid;not null"`
	Completed   bool       `json:"completed" gorm:"default:false"`
	Score       int        `json:"score" gorm:"default:0"`
	CompletedAt *time.Time `json:"completed_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`

	// Relations
	User  User  `json:"user,omitempty"`
	Topic Topic `json:"topic,omitempty"`
}

type Achievement struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	Points      int       `json:"points" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
