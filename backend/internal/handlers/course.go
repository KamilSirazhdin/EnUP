package handlers

import (
	"net/http"
	"english-learning-app/internal/database"
	"english-learning-app/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetLevels(c *gin.Context) {
	var levels []models.Level
	if err := database.DB.Preload("Topics").Order("`order`").Find(&levels).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch levels"})
		return
	}

	c.JSON(http.StatusOK, levels)
}

func GetLevel(c *gin.Context) {
	levelID := c.Param("id")
	
	var level models.Level
	if err := database.DB.Preload("Topics").Where("id = ?", levelID).First(&level).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Level not found"})
		return
	}

	c.JSON(http.StatusOK, level)
}

func GetTopics(c *gin.Context) {
	levelID := c.Param("id")
	
	var topics []models.Topic
	if err := database.DB.Where("level_id = ?", levelID).Order("`order`").Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
		return
	}

	c.JSON(http.StatusOK, topics)
}

func GetTopic(c *gin.Context) {
	topicID := c.Param("id")
	
	var topic models.Topic
	if err := database.DB.Preload("Exercises").Where("id = ?", topicID).First(&topic).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	c.JSON(http.StatusOK, topic)
}

func GetExercise(c *gin.Context) {
	exerciseID := c.Param("id")
	
	var exercise models.Exercise
	if err := database.DB.Where("id = ?", exerciseID).First(&exercise).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exercise not found"})
		return
	}

	// Don't send correct answer to client
	exercise.CorrectAnswer = ""

	c.JSON(http.StatusOK, exercise)
}

func SubmitExercise(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	exerciseID := c.Param("id")
	
	var req struct {
		Answer string `json:"answer" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get exercise
	var exercise models.Exercise
	if err := database.DB.Where("id = ?", exerciseID).First(&exercise).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exercise not found"})
		return
	}

	// Check answer
	isCorrect := req.Answer == exercise.CorrectAnswer
	score := 0
	if isCorrect {
		score = exercise.Points
	}

	// Save attempt
	attempt := models.ExerciseAttempt{
		UserID:      userID.(uuid.UUID),
		ExerciseID:  uuid.MustParse(exerciseID),
		Answer:      req.Answer,
		IsCorrect:   isCorrect,
		Score:       score,
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attempt"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"is_correct": isCorrect,
		"score":      score,
		"explanation": exercise.Explanation,
	})
}

// Admin handlers
func CreateLevel(c *gin.Context) {
	var level models.Level
	if err := c.ShouldBindJSON(&level); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&level).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create level"})
		return
	}

	c.JSON(http.StatusCreated, level)
}

func UpdateLevel(c *gin.Context) {
	levelID := c.Param("id")
	
	var level models.Level
	if err := c.ShouldBindJSON(&level); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Where("id = ?", levelID).Updates(&level).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update level"})
		return
	}

	c.JSON(http.StatusOK, level)
}

func DeleteLevel(c *gin.Context) {
	levelID := c.Param("id")
	
	if err := database.DB.Where("id = ?", levelID).Delete(&models.Level{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete level"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Level deleted successfully"})
}

func CreateTopic(c *gin.Context) {
	var topic models.Topic
	if err := c.ShouldBindJSON(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
		return
	}

	c.JSON(http.StatusCreated, topic)
}

func UpdateTopic(c *gin.Context) {
	topicID := c.Param("id")
	
	var topic models.Topic
	if err := c.ShouldBindJSON(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Where("id = ?", topicID).Updates(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update topic"})
		return
	}

	c.JSON(http.StatusOK, topic)
}

func DeleteTopic(c *gin.Context) {
	topicID := c.Param("id")
	
	if err := database.DB.Where("id = ?", topicID).Delete(&models.Topic{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete topic"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
}

func CreateExercise(c *gin.Context) {
	var exercise models.Exercise
	if err := c.ShouldBindJSON(&exercise); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&exercise).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exercise"})
		return
	}

	c.JSON(http.StatusCreated, exercise)
}

func UpdateExercise(c *gin.Context) {
	exerciseID := c.Param("id")
	
	var exercise models.Exercise
	if err := c.ShouldBindJSON(&exercise); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Where("id = ?", exerciseID).Updates(&exercise).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update exercise"})
		return
	}

	c.JSON(http.StatusOK, exercise)
}

func DeleteExercise(c *gin.Context) {
	exerciseID := c.Param("id")
	
	if err := database.DB.Where("id = ?", exerciseID).Delete(&models.Exercise{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete exercise"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Exercise deleted successfully"})
}
