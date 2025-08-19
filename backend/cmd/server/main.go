package main

import (
	"english-learning-app/internal/config"
	"english-learning-app/internal/database"
	"english-learning-app/internal/handlers"
	"english-learning-app/internal/middleware"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default values")
	}

	// Load configuration
	cfg := config.LoadConfig()

	// Connect to database
	if err := database.ConnectDB(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed data
	if err := database.SeedData(); err != nil {
		log.Fatal("Failed to seed database:", err)
	}

	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Public routes
	router.POST("/api/auth/register", handlers.Register)
	router.POST("/api/auth/login", handlers.Login)
	router.POST("/api/auth/refresh", handlers.RefreshToken)

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		// User routes
		protected.GET("/user/profile", handlers.GetProfile)
		protected.PUT("/user/profile", handlers.UpdateProfile)

		// Levels and topics
		protected.GET("/levels", handlers.GetLevels)
		protected.GET("/levels/:id", handlers.GetLevel)
		protected.GET("/levels/:id/topics", handlers.GetTopics)
		protected.GET("/topics/:id", handlers.GetTopic)

		// Progress
		protected.GET("/progress", handlers.GetUserProgress)
		protected.POST("/progress/complete", handlers.CompleteTopic)

		// Exercises
		protected.GET("/exercises/:id", handlers.GetExercise)
		protected.POST("/exercises/:id/attempt", handlers.SubmitExercise)

		// AI Chat
		protected.GET("/chat/sessions", handlers.GetChatSessions)
		protected.POST("/chat/sessions", handlers.CreateChatSession)
		protected.GET("/chat/sessions/:id/messages", handlers.GetChatMessages)
		protected.POST("/chat/sessions/:id/messages", handlers.SendMessage)

		// Leaderboard
		protected.GET("/leaderboard", handlers.GetLeaderboard)
	}

	// Admin routes
	admin := router.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(cfg), middleware.AdminMiddleware())
	{
		admin.POST("/levels", handlers.CreateLevel)
		admin.PUT("/levels/:id", handlers.UpdateLevel)
		admin.DELETE("/levels/:id", handlers.DeleteLevel)

		admin.POST("/topics", handlers.CreateTopic)
		admin.PUT("/topics/:id", handlers.UpdateTopic)
		admin.DELETE("/topics/:id", handlers.DeleteTopic)

		admin.POST("/exercises", handlers.CreateExercise)
		admin.PUT("/exercises/:id", handlers.UpdateExercise)
		admin.DELETE("/exercises/:id", handlers.DeleteExercise)
	}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server
	log.Printf("Server starting on %s:%s", cfg.Server.Host, cfg.Server.Port)
	if err := router.Run(cfg.Server.Host + ":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
