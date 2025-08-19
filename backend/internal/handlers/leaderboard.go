package handlers

import (
	"net/http"
	"english-learning-app/internal/database"
	"github.com/gin-gonic/gin"
)

type LeaderboardEntry struct {
	UserID   string `json:"user_id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Level    string `json:"level"`
	Points   int    `json:"points"`
	TopicsCompleted int `json:"topics_completed"`
}

func GetLeaderboard(c *gin.Context) {
	var entries []LeaderboardEntry
	
	// Get top users by points
	err := database.DB.Table("users").
		Select("users.id as user_id, users.name, users.email, users.level, users.points, COUNT(user_progress.id) as topics_completed").
		Joins("LEFT JOIN user_progress ON users.id = user_progress.user_id AND user_progress.completed = true").
		Group("users.id, users.name, users.email, users.level, users.points").
		Order("users.points DESC, topics_completed DESC").
		Limit(50).
		Find(&entries).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}

	c.JSON(http.StatusOK, entries)
}
