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

		api.POST("/auth/refresh", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"access_token":  "new-mock-access-token",
				"refresh_token": "new-mock-refresh-token",
			})
		})

		// User endpoints
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

		api.PUT("/user/profile", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"id":     "1",
				"name":   "Test User",
				"email":  "test@example.com",
				"level":  "A0",
				"points": 150,
			})
		})

		// Progress endpoints
		api.GET("/progress", func(c *gin.Context) {
			c.JSON(200, []gin.H{})
		})

		api.POST("/progress/complete", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Topic completed successfully"})
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

		api.GET("/levels/:id", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"id":          c.Param("id"),
				"name":        "A0",
				"title":       "Beginner",
				"description": "Absolute beginner level",
				"order":       1,
				"is_active":   true,
			})
		})

		// Topics endpoints
		api.GET("/levels/:id/topics", func(c *gin.Context) {
			levelID := c.Param("id")

			// Return different topics based on level
			switch levelID {
			case "1": // A0
				c.JSON(200, []gin.H{
					{
						"id":          "1",
						"name":        "greetings",
						"title":       "Приветствия",
						"description": "Изучим основные приветствия на английском языке",
						"order":       1,
						"is_active":   true,
					},
					{
						"id":          "2",
						"name":        "numbers_1_20",
						"title":       "Числа от 1 до 20",
						"description": "Научимся считать от 1 до 20 на английском языке",
						"order":       2,
						"is_active":   true,
					},
					{
						"id":          "3",
						"name":        "colors",
						"title":       "Цвета",
						"description": "Изучим основные цвета на английском языке",
						"order":       3,
						"is_active":   true,
					},
				})
			case "2": // A1
				c.JSON(200, []gin.H{
					{
						"id":          "4",
						"name":        "family",
						"title":       "Семья",
						"description": "Изучим слова для обозначения членов семьи",
						"order":       1,
						"is_active":   true,
					},
					{
						"id":          "5",
						"name":        "food_drinks",
						"title":       "Еда и напитки",
						"description": "Изучим названия основных продуктов питания и напитков",
						"order":       2,
						"is_active":   true,
					},
					{
						"id":          "6",
						"name":        "daily_routine",
						"title":       "Распорядок дня",
						"description": "Изучим слова для описания повседневных действий",
						"order":       3,
						"is_active":   true,
					},
				})
			case "3": // A2
				c.JSON(200, []gin.H{
					{
						"id":          "7",
						"name":        "weather",
						"title":       "Погода",
						"description": "Изучим слова для описания погоды и времен года",
						"order":       1,
						"is_active":   true,
					},
					{
						"id":          "8",
						"name":        "shopping",
						"title":       "Покупки",
						"description": "Изучим слова для похода в магазин",
						"order":       2,
						"is_active":   true,
					},
					{
						"id":          "9",
						"name":        "hobbies",
						"title":       "Хобби и увлечения",
						"description": "Изучим слова для описания хобби и свободного времени",
						"order":       3,
						"is_active":   true,
					},
				})
			default:
				c.JSON(200, []gin.H{})
			}
		})

		api.GET("/topics/:id", func(c *gin.Context) {
			topicID := c.Param("id")

			// Return different content based on topic ID
			switch topicID {
			case "1": // Greetings
				c.JSON(200, gin.H{
					"id":          "1",
					"name":        "greetings",
					"title":       "Приветствия",
					"description": "Изучим основные приветствия на английском языке",
					"content": `<h2>Приветствия в английском языке</h2>
<p>Приветствия - это первые слова, которые мы говорим при встрече с людьми. В английском языке есть несколько способов поздороваться в зависимости от времени дня и формальности ситуации.</p>

<h3>Основные приветствия:</h3>
<ul>
<li><strong>Hello</strong> - универсальное приветствие, подходит для любого времени дня</li>
<li><strong>Hi</strong> - более неформальное приветствие, используется между друзьями</li>
<li><strong>Good morning</strong> - доброе утро (до 12:00)</li>
<li><strong>Good afternoon</strong> - добрый день (12:00-17:00)</li>
<li><strong>Good evening</strong> - добрый вечер (после 17:00)</li>
</ul>

<h3>Как ответить на приветствие:</h3>
<p>Обычно отвечают тем же приветствием или просто "Hello" / "Hi".</p>

<h3>Примеры диалогов:</h3>
<div class="example">
<p><strong>Формальная ситуация:</strong></p>
<p>A: Good morning! (Доброе утро!)</p>
<p>B: Good morning! How are you? (Доброе утро! Как дела?)</p>
</div>

<div class="example">
<p><strong>Неформальная ситуация:</strong></p>
<p>A: Hi! (Привет!)</p>
<p>B: Hi! Nice to see you! (Привет! Рад тебя видеть!)</p>
</div>`,
					"order":     1,
					"is_active": true,
					"exercises": []gin.H{
						{
							"id":       "1",
							"type":     "multiple_choice",
							"question": "Как сказать 'Привет' на английском?",
							"options":  []string{"Hello", "Goodbye", "Thank you", "Please"},
							"points":   10,
							"order":    1,
						},
						{
							"id":       "2",
							"type":     "multiple_choice",
							"question": "Какое приветствие используется утром?",
							"options":  []string{"Good evening", "Good morning", "Good afternoon", "Good night"},
							"points":   10,
							"order":    2,
						},
						{
							"id":       "3",
							"type":     "fill_blank",
							"question": "Заполните пропуск: '___ morning! How are you?'",
							"points":   15,
							"order":    3,
						},
					},
				})
			case "2": // Numbers
				c.JSON(200, gin.H{
					"id":          "2",
					"name":        "numbers_1_20",
					"title":       "Числа от 1 до 20",
					"description": "Научимся считать от 1 до 20 на английском языке",
					"content": `<h2>Числа от 1 до 20</h2>
<p>Числа - это основа для общения на любом языке. Давайте изучим числа от 1 до 20, которые часто используются в повседневной жизни.</p>

<h3>Числа от 1 до 10:</h3>
<ul>
<li>1 - one</li>
<li>2 - two</li>
<li>3 - three</li>
<li>4 - four</li>
<li>5 - five</li>
<li>6 - six</li>
<li>7 - seven</li>
<li>8 - eight</li>
<li>9 - nine</li>
<li>10 - ten</li>
</ul>

<h3>Числа от 11 до 20:</h3>
<ul>
<li>11 - eleven</li>
<li>12 - twelve</li>
<li>13 - thirteen</li>
<li>14 - fourteen</li>
<li>15 - fifteen</li>
<li>16 - sixteen</li>
<li>17 - seventeen</li>
<li>18 - eighteen</li>
<li>19 - nineteen</li>
<li>20 - twenty</li>
</ul>

<h3>Важные правила:</h3>
<p><strong>Обратите внимание:</strong> числа 13-19 заканчиваются на "-teen", а 20 - это "twenty".</p>

<h3>Примеры использования:</h3>
<div class="example">
<p><strong>Счет предметов:</strong></p>
<p>I have five apples. (У меня пять яблок.)</p>
<p>There are twelve students in the class. (В классе двенадцать студентов.)</p>
</div>

<div class="example">
<p><strong>Возраст:</strong></p>
<p>I am fifteen years old. (Мне пятнадцать лет.)</p>
<p>My sister is eight years old. (Моей сестре восемь лет.)</p>
</div>`,
					"order":     2,
					"is_active": true,
					"exercises": []gin.H{
						{
							"id":       "4",
							"type":     "multiple_choice",
							"question": "Как сказать число '5' на английском?",
							"options":  []string{"Three", "Four", "Five", "Six"},
							"points":   10,
							"order":    1,
						},
						{
							"id":       "5",
							"type":     "multiple_choice",
							"question": "Какое число идет после 'ten'?",
							"options":  []string{"Nine", "Eleven", "Twelve", "Thirteen"},
							"points":   10,
							"order":    2,
						},
						{
							"id":       "6",
							"type":     "fill_blank",
							"question": "Заполните пропуск: 'I have ___ apples.' (число 3)",
							"points":   15,
							"order":    3,
						},
					},
				})
			default:
				c.JSON(200, gin.H{
					"id":          topicID,
					"name":        "topic",
					"title":       "Тема",
					"description": "Описание темы",
					"content":     "<p>Содержание темы</p>",
					"order":       1,
					"is_active":   true,
					"exercises":   []gin.H{},
				})
			}
		})

		// Exercises endpoints
		api.GET("/exercises/:id", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"id":       c.Param("id"),
				"type":     "multiple_choice",
				"question": "How do you say 'Hello' in English?",
				"options":  []string{"Hello", "Goodbye", "Thank you", "Please"},
				"points":   10,
				"order":    1,
			})
		})

		api.POST("/exercises/:id/attempt", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"is_correct":  true,
				"score":       10,
				"explanation": "Correct! 'Hello' is the standard greeting in English.",
			})
		})

		// Chat endpoints
		api.GET("/chat/sessions", func(c *gin.Context) {
			c.JSON(200, []gin.H{
				{
					"id":        "1",
					"title":     "General Help",
					"is_active": true,
				},
			})
		})

		api.POST("/chat/sessions", func(c *gin.Context) {
			c.JSON(201, gin.H{
				"id":        "1",
				"title":     "New Session",
				"is_active": true,
			})
		})

		api.GET("/chat/sessions/:id/messages", func(c *gin.Context) {
			c.JSON(200, []gin.H{
				{
					"id":         "1",
					"role":       "user",
					"content":    "Hello!",
					"created_at": "2024-01-15T10:00:00Z",
				},
				{
					"id":         "2",
					"role":       "assistant",
					"content":    "Hi there! How can I help you with your English learning today?",
					"created_at": "2024-01-15T10:00:05Z",
				},
			})
		})

		api.POST("/chat/sessions/:id/messages", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"user_message": gin.H{
					"id":         "3",
					"role":       "user",
					"content":    "Can you help me with grammar?",
					"created_at": "2024-01-15T10:01:00Z",
				},
				"ai_message": gin.H{
					"id":         "4",
					"role":       "assistant",
					"content":    "Of course! I'd be happy to help you with grammar. What specific topic would you like to work on?",
					"created_at": "2024-01-15T10:01:05Z",
				},
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
