import questions from "./questions.json" with { type: "json" };

export const getRandomQuestion = (topic) => {
  const questionsByTopic = topic.toLowerCase();
  const randomIndex = Math.floor(
    Math.random() * questions[questionsByTopic].length
  );
  return questions[questionsByTopic][randomIndex];
};



// Function to sanitize HTML content for Telegram
const sanitizeHtml = (html) => {
    if (!html) return html;
    
    // Replace problematic HTML patterns that cause parsing errors
    return html
        // Fix any remaining single quotes in HTML attributes
        .replace(/href='([^']*)'(\s+target='[^']*')?/g, 'href="$1"$2')
        .replace(/target='([^']*)'/g, 'target="$1"')
        // Ensure proper HTML tag formatting
        .replace(/<code>/g, '<code>')
        .replace(/<\/code>/g, '</code>')
        // Remove any stray backticks that might interfere with HTML parsing
        .replace(/^`+/, '')
        .replace(/`+$/, '');
};

export const getCorrectAnswer = (topic, questionId) => {
    // Convert topic to lowercase to match the JSON keys
    const topicKey = topic.toLowerCase();
    
    // Check if the topic exists in questions
    if (!questions[topicKey]) {
        console.error(`Topic "${topic}" not found in questions`);
        return 'Извините, произошла ошибка при поиске ответа.';
    }
    
    // Find the question by ID
    const question = questions[topicKey].find(
        (q) => q.id === questionId
    );
    
    // If question not found
    if (!question) {
        console.error(`Question with ID ${questionId} not found in topic "${topic}"`);
        return 'Извините, не удалось найти ответ на этот вопрос.';
    }
    
    // Get the raw answer
    let answer;
    if (!question.hasOptions) {
        answer = question.answer || question.correctAnswer || 'Ответ не найден.';
    } else {
        // Find and return the correct option text
        const correctOption = question.options?.find((option) => option.isCorrect);
        answer = correctOption?.text || 'Правильный ответ не найден.';
    }
    
    // Sanitize HTML content before returning
    return sanitizeHtml(answer);
};


