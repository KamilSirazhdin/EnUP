package handlers

import (
	"net/http"
	"english-learning-app/internal/database"
	"english-learning-app/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user models.User
	if err := database.DB.Preload("Progress").Preload("Achievements").Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Clear password
	user.Password = ""

	c.JSON(http.StatusOK, user)
}

func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update fields
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Avatar != "" {
		user.Avatar = &req.Avatar
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// Clear password
	user.Password = ""

	c.JSON(http.StatusOK, user)
}

func GetUserProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var progress []models.UserProgress
	if err := database.DB.Preload("Topic").Where("user_id = ?", userID).Find(&progress).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch progress"})
		return
	}

	c.JSON(http.StatusOK, progress)
}

func CompleteTopic(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		TopicID uuid.UUID `json:"topic_id" binding:"required"`
		Score   int       `json:"score"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if progress already exists
	var existingProgress models.UserProgress
	err := database.DB.Where("user_id = ? AND topic_id = ?", userID, req.TopicID).First(&existingProgress).Error

	if err == nil {
		// Update existing progress
		existingProgress.Completed = true
		existingProgress.Score = req.Score
		if err := database.DB.Save(&existingProgress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update progress"})
			return
		}
	} else {
		// Create new progress
		progress := models.UserProgress{
			UserID:    userID.(uuid.UUID),
			TopicID:   req.TopicID,
			Completed: true,
			Score:     req.Score,
		}
		if err := database.DB.Create(&progress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create progress"})
			return
		}
	}

	// Update user points
	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Points += req.Score
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user points"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic completed successfully"})
}
