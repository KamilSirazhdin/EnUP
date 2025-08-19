package models

import (
	"time"

	"github.com/google/uuid"
)

type ChatSession struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID    uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	TopicID   *uuid.UUID `json:"topic_id" gorm:"type:uuid"`
	Title     string     `json:"title"`
	IsActive  bool       `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`

	// Relations
	User     User          `json:"user,omitempty"`
	Topic    *Topic        `json:"topic,omitempty"`
	Messages []ChatMessage `json:"messages,omitempty" gorm:"foreignKey:SessionID"`
}

type ChatMessage struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	SessionID uuid.UUID `json:"session_id" gorm:"type:uuid;not null"`
	Role      string    `json:"role" gorm:"not null"` // user, assistant
	Content   string    `json:"content" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	Session ChatSession `json:"session,omitempty"`
}
