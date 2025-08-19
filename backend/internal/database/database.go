package database

import (
	"english-learning-app/internal/config"
	"english-learning-app/internal/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB(cfg *config.Config) error {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.DBName,
		cfg.Database.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = db
	log.Println("Database connected successfully")
	return nil
}

func AutoMigrate() error {
	err := DB.AutoMigrate(
		&models.User{},
		&models.UserProgress{},
		&models.Achievement{},
		&models.Level{},
		&models.Topic{},
		&models.Exercise{},
		&models.ExerciseAttempt{},
		&models.ChatSession{},
		&models.ChatMessage{},
	)
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migrated successfully")
	return nil
}

func SeedData() error {
	// Seed levels
	levels := []models.Level{
		{Name: "A0", Title: "Beginner", Description: "Absolute beginner level", Order: 1},
		{Name: "A1", Title: "Elementary", Description: "Basic knowledge", Order: 2},
		{Name: "A2", Title: "Pre-Intermediate", Description: "Elementary proficiency", Order: 3},
		{Name: "B1", Title: "Intermediate", Description: "Intermediate level", Order: 4},
		{Name: "B2", Title: "Upper-Intermediate", Description: "Upper intermediate", Order: 5},
		{Name: "C1", Title: "Advanced", Description: "Advanced level", Order: 6},
		{Name: "C2", Title: "Proficiency", Description: "Mastery level", Order: 7},
	}

	for _, level := range levels {
		var existingLevel models.Level
		if err := DB.Where("name = ?", level.Name).First(&existingLevel).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&level).Error; err != nil {
					return fmt.Errorf("failed to seed level %s: %w", level.Name, err)
				}
			}
		}
	}

	// Seed topics for A0 level
	a0Topics := []models.Topic{
		{
			Name:        "greetings",
			Title:       "Приветствия",
			Description: "Изучим основные приветствия на английском языке",
			Content: `<h2>Приветствия в английском языке</h2>
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
			Order:    1,
			IsActive: true,
		},
		{
			Name:        "numbers_1_20",
			Title:       "Числа от 1 до 20",
			Description: "Научимся считать от 1 до 20 на английском языке",
			Content: `<h2>Числа от 1 до 20</h2>
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
			Order:    2,
			IsActive: true,
		},
		{
			Name:        "colors",
			Title:       "Цвета",
			Description: "Изучим основные цвета на английском языке",
			Content: `<h2>Основные цвета</h2>
<p>Цвета окружают нас повсюду. Знание цветов поможет вам описывать предметы и мир вокруг вас.</p>

<h3>Основные цвета:</h3>
<ul>
<li><strong>Red</strong> - красный</li>
<li><strong>Blue</strong> - синий</li>
<li><strong>Green</strong> - зеленый</li>
<li><strong>Yellow</strong> - желтый</li>
<li><strong>Black</strong> - черный</li>
<li><strong>White</strong> - белый</li>
<li><strong>Orange</strong> - оранжевый</li>
<li><strong>Purple</strong> - фиолетовый</li>
<li><strong>Pink</strong> - розовый</li>
<li><strong>Brown</strong> - коричневый</li>
</ul>

<h3>Как использовать цвета в предложениях:</h3>
<p>В английском языке цвет обычно ставится перед существительным:</p>
<div class="example">
<p>The red car (красная машина)</p>
<p>A blue sky (синее небо)</p>
<p>Green grass (зеленая трава)</p>
</div>

<h3>Примеры предложений:</h3>
<div class="example">
<p>I like the blue color. (Мне нравится синий цвет.)</p>
<p>The sky is blue today. (Сегодня небо синее.)</p>
<p>She has a red dress. (У неё красное платье.)</p>
<p>My favorite color is green. (Мой любимый цвет - зеленый.)</p>
</div>`,
			Order:    3,
			IsActive: true,
		},
	}

	// Seed topics for A1 level
	a1Topics := []models.Topic{
		{
			Name:        "family",
			Title:       "Семья",
			Description: "Изучим слова для обозначения членов семьи",
			Content: `<h2>Члены семьи</h2>
<p>Семья - это самые близкие люди в нашей жизни. Давайте изучим, как называть членов семьи на английском языке.</p>

<h3>Основные члены семьи:</h3>
<ul>
<li><strong>Mother / Mom</strong> - мама</li>
<li><strong>Father / Dad</strong> - папа</li>
<li><strong>Brother</strong> - брат</li>
<li><strong>Sister</strong> - сестра</li>
<li><strong>Son</strong> - сын</li>
<li><strong>Daughter</strong> - дочь</li>
<li><strong>Grandmother / Grandma</strong> - бабушка</li>
<li><strong>Grandfather / Grandpa</strong> - дедушка</li>
<li><strong>Uncle</strong> - дядя</li>
<li><strong>Aunt</strong> - тетя</li>
<li><strong>Cousin</strong> - двоюродный брат/сестра</li>
</ul>

<h3>Примеры предложений:</h3>
<div class="example">
<p>I have a big family. (У меня большая семья.)</p>
<p>My mother's name is Anna. (Мою маму зовут Анна.)</p>
<p>I have two brothers and one sister. (У меня два брата и одна сестра.)</p>
<p>My grandmother lives with us. (Моя бабушка живет с нами.)</p>
</div>

<h3>Вопросы о семье:</h3>
<div class="example">
<p>How many people are in your family? (Сколько человек в твоей семье?)</p>
<p>Do you have any brothers or sisters? (У тебя есть братья или сестры?)</p>
<p>What's your mother's name? (Как зовут твою маму?)</p>
</div>`,
			Order:    1,
			IsActive: true,
		},
		{
			Name:        "food_drinks",
			Title:       "Еда и напитки",
			Description: "Изучим названия основных продуктов питания и напитков",
			Content: `<h2>Еда и напитки</h2>
<p>Еда - важная часть нашей жизни. Давайте изучим основные слова для еды и напитков.</p>

<h3>Основные продукты:</h3>
<ul>
<li><strong>Bread</strong> - хлеб</li>
<li><strong>Milk</strong> - молоко</li>
<li><strong>Eggs</strong> - яйца</li>
<li><strong>Cheese</strong> - сыр</li>
<li><strong>Meat</strong> - мясо</li>
<li><strong>Fish</strong> - рыба</li>
<li><strong>Rice</strong> - рис</li>
<li><strong>Potatoes</strong> - картофель</li>
<li><strong>Tomatoes</strong> - помидоры</li>
<li><strong>Apples</strong> - яблоки</li>
</ul>

<h3>Напитки:</h3>
<ul>
<li><strong>Water</strong> - вода</li>
<li><strong>Tea</strong> - чай</li>
<li><strong>Coffee</strong> - кофе</li>
<li><strong>Juice</strong> - сок</li>
<li><strong>Milk</strong> - молоко</li>
</ul>

<h3>Полезные фразы:</h3>
<div class="example">
<p>I'm hungry. (Я голоден.)</p>
<p>I'm thirsty. (Я хочу пить.)</p>
<p>I like pizza. (Мне нравится пицца.)</p>
<p>I don't like fish. (Мне не нравится рыба.)</p>
<p>What's for dinner? (Что на ужин?)</p>
</div>

<h3>Примеры предложений:</h3>
<div class="example">
<p>I eat bread for breakfast. (Я ем хлеб на завтрак.)</p>
<p>My favorite drink is orange juice. (Мой любимый напиток - апельсиновый сок.)</p>
<p>We have meat and potatoes for dinner. (На ужин у нас мясо и картофель.)</p>
</div>`,
			Order:    2,
			IsActive: true,
		},
		{
			Name:        "daily_routine",
			Title:       "Распорядок дня",
			Description: "Изучим слова для описания повседневных действий",
			Content: `<h2>Распорядок дня</h2>
<p>Каждый день мы выполняем множество действий. Давайте изучим, как рассказать о своем распорядке дня на английском языке.</p>

<h3>Основные действия:</h3>
<ul>
<li><strong>Wake up</strong> - просыпаться</li>
<li><strong>Get up</strong> - вставать</li>
<li><strong>Have breakfast</strong> - завтракать</li>
<li><strong>Go to work/school</strong> - идти на работу/в школу</li>
<li><strong>Have lunch</strong> - обедать</li>
<li><strong>Have dinner</strong> - ужинать</li>
<li><strong>Go home</strong> - идти домой</li>
<li><strong>Watch TV</strong> - смотреть телевизор</li>
<li><strong>Go to bed</strong> - ложиться спать</li>
<li><strong>Sleep</strong> - спать</li>
</ul>

<h3>Время дня:</h3>
<ul>
<li><strong>Morning</strong> - утро</li>
<li><strong>Afternoon</strong> - день</li>
<li><strong>Evening</strong> - вечер</li>
<li><strong>Night</strong> - ночь</li>
</ul>

<h3>Примеры предложений:</h3>
<div class="example">
<p>I wake up at 7 o'clock. (Я просыпаюсь в 7 часов.)</p>
<p>I have breakfast in the morning. (Я завтракаю утром.)</p>
<p>I go to work at 9 o'clock. (Я иду на работу в 9 часов.)</p>
<p>I go to bed at 11 o'clock. (Я ложусь спать в 11 часов.)</p>
</div>

<h3>Вопросы о распорядке дня:</h3>
<div class="example">
<p>What time do you wake up? (Во сколько ты просыпаешься?)</p>
<p>What do you do in the morning? (Что ты делаешь утром?)</p>
<p>When do you go to bed? (Когда ты ложишься спать?)</p>
</div>`,
			Order:    3,
			IsActive: true,
		},
	}

	// Seed topics for A2 level
	a2Topics := []models.Topic{
		{
			Name:        "weather",
			Title:       "Погода",
			Description: "Изучим слова для описания погоды и времен года",
			Content: `<h2>Погода и времена года</h2>
<p>Погода - популярная тема для разговора. Давайте изучим, как описывать погоду на английском языке.</p>

<h3>Времена года:</h3>
<ul>
<li><strong>Spring</strong> - весна</li>
<li><strong>Summer</strong> - лето</li>
<li><strong>Autumn / Fall</strong> - осень</li>
<li><strong>Winter</strong> - зима</li>
</ul>

<h3>Погодные условия:</h3>
<ul>
<li><strong>Sunny</strong> - солнечно</li>
<li><strong>Cloudy</strong> - облачно</li>
<li><strong>Rainy</strong> - дождливо</li>
<li><strong>Snowy</strong> - снежно</li>
<li><strong>Windy</strong> - ветрено</li>
<li><strong>Hot</strong> - жарко</li>
<li><strong>Cold</strong> - холодно</li>
<li><strong>Warm</strong> - тепло</li>
<li><strong>Cool</strong> - прохладно</li>
</ul>

<h3>Примеры предложений:</h3>
<div class="example">
<p>It's sunny today. (Сегодня солнечно.)</p>
<p>The weather is cold in winter. (Зимой погода холодная.)</p>
<p>It's raining today. (Сегодня идет дождь.)</p>
<p>I like warm weather. (Мне нравится теплая погода.)</p>
</div>

<h3>Вопросы о погоде:</h3>
<div class="example">
<p>What's the weather like today? (Какая сегодня погода?)</p>
<p>What's your favorite season? (Какое твое любимое время года?)</p>
<p>Do you like rainy weather? (Тебе нравится дождливая погода?)</p>
</div>`,
			Order:    1,
			IsActive: true,
		},
		{
			Name:        "shopping",
			Title:       "Покупки",
			Description: "Изучим слова для похода в магазин",
			Content: `<h2>Покупки в магазине</h2>
<p>Покупки - важная часть нашей жизни. Давайте изучим, как общаться в магазине на английском языке.</p>

<h3>Типы магазинов:</h3>
<ul>
<li><strong>Supermarket</strong> - супермаркет</li>
<li><strong>Shop / Store</strong> - магазин</li>
<li><strong>Market</strong> - рынок</li>
<li><strong>Bakery</strong> - пекарня</li>
<li><strong>Butcher's</strong> - мясная лавка</li>
</ul>

<h3>Полезные фразы:</h3>
<div class="example">
<p>Can I help you? (Могу я вам помочь?)</p>
<p>I'm looking for... (Я ищу...)</p>
<p>How much is this? (Сколько это стоит?)</p>
<p>It's too expensive. (Это слишком дорого.)</p>
<p>I'll take it. (Я возьму это.)</p>
<p>Do you have...? (У вас есть...?)</p>
</div>

<h3>Примеры диалогов:</h3>
<div class="example">
<p><strong>В супермаркете:</strong></p>
<p>Customer: Excuse me, where is the bread? (Извините, где хлеб?)</p>
<p>Assistant: It's in aisle 3. (В третьем проходе.)</p>
<p>Customer: Thank you! (Спасибо!)</p>
</div>

<div class="example">
<p><strong>На кассе:</strong></p>
<p>Cashier: That's $15.50. (Это 15 долларов 50 центов.)</p>
<p>Customer: Here you are. (Вот, пожалуйста.)</p>
<p>Cashier: Thank you! Have a nice day! (Спасибо! Хорошего дня!)</p>
</div>`,
			Order:    2,
			IsActive: true,
		},
		{
			Name:        "hobbies",
			Title:       "Хобби и увлечения",
			Description: "Изучим слова для описания хобби и свободного времени",
			Content: `<h2>Хобби и увлечения</h2>
<p>Хобби помогают нам расслабиться и получать удовольствие от жизни. Давайте изучим, как рассказать о своих увлечениях.</p>

<h3>Популярные хобби:</h3>
<ul>
<li><strong>Reading</strong> - чтение</li>
<li><strong>Watching TV</strong> - просмотр телевизора</li>
<li><strong>Listening to music</strong> - прослушивание музыки</li>
<li><strong>Playing sports</strong> - занятия спортом</li>
<li><strong>Cooking</strong> - готовка</li>
<li><strong>Gardening</strong> - садоводство</li>
<li><strong>Photography</strong> - фотография</li>
<li><strong>Painting</strong> - рисование</li>
<li><strong>Dancing</strong> - танцы</li>
<li><strong>Swimming</strong> - плавание</li>
</ul>

<h3>Полезные фразы:</h3>
<div class="example">
<p>I like... (Мне нравится...)</p>
<p>I love... (Я люблю...)</p>
<p>I enjoy... (Мне нравится...)</p>
<p>My hobby is... (Мое хобби - это...)</p>
<p>In my free time, I... (В свободное время я...)</p>
</div>

<h3>Примеры предложений:</h3>
<div class="example">
<p>I like reading books. (Мне нравится читать книги.)</p>
<p>My hobby is photography. (Мое хобби - фотография.)</p>
<p>In my free time, I play football. (В свободное время я играю в футбол.)</p>
<p>I love cooking Italian food. (Я люблю готовить итальянскую еду.)</p>
</div>

<h3>Вопросы о хобби:</h3>
<div class="example">
<p>What do you like doing in your free time? (Что ты любишь делать в свободное время?)</p>
<p>What's your hobby? (Какое у тебя хобби?)</p>
<p>Do you like sports? (Тебе нравятся спорт?)</p>
<p>How often do you...? (Как часто ты...?)</p>
</div>`,
			Order:    3,
			IsActive: true,
		},
	}

	// Get level IDs first
	var a0Level, a1Level, a2Level models.Level
	if err := DB.Where("name = ?", "A0").First(&a0Level).Error; err != nil {
		return fmt.Errorf("failed to find A0 level: %w", err)
	}
	if err := DB.Where("name = ?", "A1").First(&a1Level).Error; err != nil {
		return fmt.Errorf("failed to find A1 level: %w", err)
	}
	if err := DB.Where("name = ?", "A2").First(&a2Level).Error; err != nil {
		return fmt.Errorf("failed to find A2 level: %w", err)
	}

	// Create topics for each level
	for _, topic := range a0Topics {
		topic.LevelID = a0Level.ID
		if err := DB.Where("name = ? AND level_id = ?", topic.Name, topic.LevelID).First(&models.Topic{}).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&topic).Error; err != nil {
					return fmt.Errorf("failed to seed A0 topic %s: %w", topic.Name, err)
				}
			}
		}
	}

	for _, topic := range a1Topics {
		topic.LevelID = a1Level.ID
		if err := DB.Where("name = ? AND level_id = ?", topic.Name, topic.LevelID).First(&models.Topic{}).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&topic).Error; err != nil {
					return fmt.Errorf("failed to seed A1 topic %s: %w", topic.Name, err)
				}
			}
		}
	}

	for _, topic := range a2Topics {
		topic.LevelID = a2Level.ID
		if err := DB.Where("name = ? AND level_id = ?", topic.Name, topic.LevelID).First(&models.Topic{}).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&topic).Error; err != nil {
					return fmt.Errorf("failed to seed A2 topic %s: %w", topic.Name, err)
				}
			}
		}
	}

	// Get topic IDs after creating them
	var greetingsTopic, numbersTopic, colorsTopic, familyTopic, foodTopic, routineTopic, weatherTopic, shoppingTopic, hobbiesTopic models.Topic

	if err := DB.Where("name = ? AND level_id = ?", "greetings", a0Level.ID).First(&greetingsTopic).Error; err != nil {
		return fmt.Errorf("failed to find greetings topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "numbers_1_20", a0Level.ID).First(&numbersTopic).Error; err != nil {
		return fmt.Errorf("failed to find numbers topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "colors", a0Level.ID).First(&colorsTopic).Error; err != nil {
		return fmt.Errorf("failed to find colors topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "family", a1Level.ID).First(&familyTopic).Error; err != nil {
		return fmt.Errorf("failed to find family topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "food_drinks", a1Level.ID).First(&foodTopic).Error; err != nil {
		return fmt.Errorf("failed to find food topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "daily_routine", a1Level.ID).First(&routineTopic).Error; err != nil {
		return fmt.Errorf("failed to find routine topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "weather", a2Level.ID).First(&weatherTopic).Error; err != nil {
		return fmt.Errorf("failed to find weather topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "shopping", a2Level.ID).First(&shoppingTopic).Error; err != nil {
		return fmt.Errorf("failed to find shopping topic: %w", err)
	}
	if err := DB.Where("name = ? AND level_id = ?", "hobbies", a2Level.ID).First(&hobbiesTopic).Error; err != nil {
		return fmt.Errorf("failed to find hobbies topic: %w", err)
	}

	// Seed exercises for topics
	exercises := []models.Exercise{
		// A0 - Greetings exercises
		{
			TopicID:       greetingsTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать 'Привет' на английском?",
			Options:       []string{"Hello", "Goodbye", "Thank you", "Please"},
			CorrectAnswer: "Hello",
			Explanation:   "Hello - это универсальное приветствие на английском языке.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       greetingsTopic.ID,
			Type:          "multiple_choice",
			Question:      "Какое приветствие используется утром?",
			Options:       []string{"Good evening", "Good morning", "Good afternoon", "Good night"},
			CorrectAnswer: "Good morning",
			Explanation:   "Good morning используется с утра до 12:00.",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       greetingsTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: '___ morning! How are you?'",
			CorrectAnswer: "Good",
			Explanation:   "Good morning - стандартное утреннее приветствие.",
			Points:        15,
			Order:         3,
		},

		// A0 - Numbers exercises
		{
			TopicID:       numbersTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать число '5' на английском?",
			Options:       []string{"Three", "Four", "Five", "Six"},
			CorrectAnswer: "Five",
			Explanation:   "Five - это число 5 на английском языке.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       numbersTopic.ID,
			Type:          "multiple_choice",
			Question:      "Какое число идет после 'ten'?",
			Options:       []string{"Nine", "Eleven", "Twelve", "Thirteen"},
			CorrectAnswer: "Eleven",
			Explanation:   "После ten (10) идет eleven (11).",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       numbersTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: 'I have ___ apples.' (число 3)",
			CorrectAnswer: "three",
			Explanation:   "Three - это число 3 на английском языке.",
			Points:        15,
			Order:         3,
		},

		// A0 - Colors exercises
		{
			TopicID:       colorsTopic.ID,
			Type:          "multiple_choice",
			Question:      "Какой цвет означает 'red'?",
			Options:       []string{"Синий", "Красный", "Зеленый", "Желтый"},
			CorrectAnswer: "Красный",
			Explanation:   "Red означает красный цвет.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       colorsTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать 'синий' на английском?",
			Options:       []string{"Red", "Blue", "Green", "Yellow"},
			CorrectAnswer: "Blue",
			Explanation:   "Blue означает синий цвет.",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       colorsTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: 'The sky is ___ today.' (синий)",
			CorrectAnswer: "blue",
			Explanation:   "The sky is blue - небо синее.",
			Points:        15,
			Order:         3,
		},

		// A1 - Family exercises
		{
			TopicID:       familyTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать 'мама' на английском?",
			Options:       []string{"Father", "Mother", "Sister", "Brother"},
			CorrectAnswer: "Mother",
			Explanation:   "Mother означает мама на английском языке.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       familyTopic.ID,
			Type:          "multiple_choice",
			Question:      "Что означает 'brother'?",
			Options:       []string{"Сестра", "Брат", "Мама", "Папа"},
			CorrectAnswer: "Брат",
			Explanation:   "Brother означает брат на английском языке.",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       familyTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: 'My ___ name is John.' (папа)",
			CorrectAnswer: "father",
			Explanation:   "My father - мой папа.",
			Points:        15,
			Order:         3,
		},

		// A1 - Food exercises
		{
			TopicID:       foodTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать 'хлеб' на английском?",
			Options:       []string{"Milk", "Bread", "Cheese", "Meat"},
			CorrectAnswer: "Bread",
			Explanation:   "Bread означает хлеб на английском языке.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       foodTopic.ID,
			Type:          "multiple_choice",
			Question:      "Что означает 'milk'?",
			Options:       []string{"Вода", "Молоко", "Сок", "Чай"},
			CorrectAnswer: "Молоко",
			Explanation:   "Milk означает молоко на английском языке.",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       foodTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: 'I drink ___ every morning.' (молоко)",
			CorrectAnswer: "milk",
			Explanation:   "I drink milk - я пью молоко.",
			Points:        15,
			Order:         3,
		},

		// A2 - Weather exercises
		{
			TopicID:       weatherTopic.ID,
			Type:          "multiple_choice",
			Question:      "Как сказать 'солнечно' на английском?",
			Options:       []string{"Cloudy", "Sunny", "Rainy", "Windy"},
			CorrectAnswer: "Sunny",
			Explanation:   "Sunny означает солнечно на английском языке.",
			Points:        10,
			Order:         1,
		},
		{
			TopicID:       weatherTopic.ID,
			Type:          "multiple_choice",
			Question:      "Что означает 'cold'?",
			Options:       []string{"Жарко", "Холодно", "Тепло", "Прохладно"},
			CorrectAnswer: "Холодно",
			Explanation:   "Cold означает холодно на английском языке.",
			Points:        10,
			Order:         2,
		},
		{
			TopicID:       weatherTopic.ID,
			Type:          "fill_blank",
			Question:      "Заполните пропуск: 'It's ___ today.' (солнечно)",
			CorrectAnswer: "sunny",
			Explanation:   "It's sunny today - сегодня солнечно.",
			Points:        15,
			Order:         3,
		},
	}

	for _, exercise := range exercises {
		if err := DB.Where("topic_id = ? AND question = ?", exercise.TopicID, exercise.Question).First(&models.Exercise{}).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&exercise).Error; err != nil {
					return fmt.Errorf("failed to seed exercise: %w", err)
				}
			}
		}
	}

	// Seed achievements
	achievements := []models.Achievement{
		{Name: "First Step", Description: "Complete your first lesson", Icon: "🎯", Points: 10},
		{Name: "Dedicated Learner", Description: "Complete 10 lessons", Icon: "📚", Points: 50},
		{Name: "Level Master", Description: "Complete a full level", Icon: "🏆", Points: 100},
		{Name: "Perfect Score", Description: "Get 100% on an exercise", Icon: "⭐", Points: 25},
		{Name: "Grammar Guru", Description: "Complete all grammar exercises", Icon: "📝", Points: 75},
		{Name: "Vocabulary Master", Description: "Learn 100 new words", Icon: "📖", Points: 150},
	}

	for _, achievement := range achievements {
		var existingAchievement models.Achievement
		if err := DB.Where("name = ?", achievement.Name).First(&existingAchievement).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&achievement).Error; err != nil {
					return fmt.Errorf("failed to seed achievement %s: %w", achievement.Name, err)
				}
			}
		}
	}

	log.Println("Database seeded successfully")
	return nil
}
