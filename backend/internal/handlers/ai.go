package handlers

import (
	"context"
	"english-learning-app/internal/config"
	"english-learning-app/internal/database"
	"english-learning-app/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sashabaranov/go-openai"
)

func GetChatSessions(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var sessions []models.ChatSession
	if err := database.DB.Where("user_id = ? AND is_active = ?", userID, true).Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat sessions"})
		return
	}

	c.JSON(http.StatusOK, sessions)
}

func CreateChatSession(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		TopicID *uuid.UUID `json:"topic_id"`
		Title   string     `json:"title"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session := models.ChatSession{
		UserID:   userID.(uuid.UUID),
		TopicID:  req.TopicID,
		Title:    req.Title,
		IsActive: true,
	}

	if err := database.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat session"})
		return
	}

	c.JSON(http.StatusCreated, session)
}

func GetChatMessages(c *gin.Context) {
	_, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	sessionID := c.Param("id")

	var messages []models.ChatMessage
	if err := database.DB.Where("session_id = ?", sessionID).Order("created_at").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func SendMessage(c *gin.Context) {
	_, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	sessionID := c.Param("id")

	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save user message
	userMessage := models.ChatMessage{
		SessionID: uuid.MustParse(sessionID),
		Role:      "user",
		Content:   req.Content,
	}

	if err := database.DB.Create(&userMessage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}

	// Get AI response
	cfg := config.LoadConfig()
	aiResponse, err := getAIResponse(req.Content, cfg.OpenAI.APIKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get AI response"})
		return
	}

	// Save AI message
	aiMessage := models.ChatMessage{
		SessionID: uuid.MustParse(sessionID),
		Role:      "assistant",
		Content:   aiResponse,
	}

	if err := database.DB.Create(&aiMessage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save AI message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_message": userMessage,
		"ai_message":   aiMessage,
	})
}

func getAIResponse(userMessage, apiKey string) (string, error) {
	if apiKey == "" {
		// Mock response if no API key
		return "I'm here to help you learn English! This is a mock response. Please set up your OpenAI API key for real AI assistance.", nil
	}

	client := openai.NewClient(apiKey)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful English tutor. Help the user learn English by explaining concepts, providing examples, and answering questions in a clear and educational way.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userMessage,
				},
			},
		},
	)

	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}
