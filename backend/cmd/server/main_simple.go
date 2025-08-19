package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "English Learning API is running!"})
	})

	// Mock API endpoints
	api := router.Group("/api")
	{
		// Auth endpoints
		api.POST("/auth/register", func(c *gin.Context) {
			c.JSON(201, gin.H{
				"access_token":  "mock-access-token",
				"refresh_token": "mock-refresh-token",
				"user": gin.H{
					"id":     "1",
					"name":   "Test User",
					"email":  "test@example.com",
					"level":  "A0",
					"points": 0,
				},
			})
		})

		api.POST("/auth/login", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"access_token":  "mock-access-token",
				"refresh_token": "mock-refresh-token",
				"user": gin.H{
					"id":     "1",
					"name":   "Test User",
					"email":  "test@example.com",
					"level":  "A0",
					"points": 0,
				},
			})
		})

		// Levels endpoints
		api.GET("/levels", func(c *gin.Context) {
			c.JSON(200, []gin.H{
				{
					"id":          "1",
					"name":        "A0",
					"title":       "Beginner",
					"description": "Absolute beginner level",
					"order":       1,
					"is_active":   true,
				},
				{
					"id":          "2",
					"name":        "A1",
					"title":       "Elementary",
					"description": "Basic knowledge",
					"order":       2,
					"is_active":   true,
				},
				{
					"id":          "3",
					"name":        "A2",
					"title":       "Pre-Intermediate",
					"description": "Elementary proficiency",
					"order":       3,
					"is_active":   true,
				},
			})
		})

		// Topics endpoints
		api.GET("/levels/:id/topics", func(c *gin.Context) {
			c.JSON(200, []gin.H{
				{
					"id":          "1",
					"name":        "basic_greetings",
					"title":       "Basic Greetings",
					"description": "Learn how to greet people in English",
					"order":       1,
					"is_active":   true,
				},
				{
					"id":          "2",
					"name":        "numbers",
					"title":       "Numbers 1-20",
					"description": "Learn to count from 1 to 20",
					"order":       2,
					"is_active":   true,
				},
			})
		})

		// User profile
		api.GET("/user/profile", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"id":       "1",
				"name":     "Test User",
				"email":    "test@example.com",
				"level":    "A0",
				"points":   150,
				"progress": []gin.H{},
			})
		})

		// Progress
		api.GET("/progress", func(c *gin.Context) {
			c.JSON(200, []gin.H{})
		})

		// Complete topic
		api.POST("/progress/complete", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Topic completed successfully"})
		})

		// User profile
		api.GET("/user/profile", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"id":       "1",
				"name":     "Test User",
				"email":    "test@example.com",
				"level":    "A0",
				"points":   150,
				"progress": []gin.H{},
			})
		})

		// Leaderboard
		api.GET("/leaderboard", func(c *gin.Context) {
			c.JSON(200, []gin.H{
				{
					"user_id":          "1",
					"name":             "Test User",
					"email":            "test@example.com",
					"level":            "A0",
					"points":           150,
					"topics_completed": 3,
				},
				{
					"user_id":          "2",
					"name":             "John Doe",
					"email":            "john@example.com",
					"level":            "A1",
					"points":           120,
					"topics_completed": 2,
				},
			})
		})
	}

	// Start server
	log.Printf("Mock server starting on localhost:8080")
	if err := router.Run("localhost:8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
