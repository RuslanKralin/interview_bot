import questions from "./questions.json" with { type: "json" };

export const getRandomQuestion = (topic) => {
  const questionsByTopic = topic.toLowerCase();
  const randomIndex = Math.floor(
    Math.random() * questions[questionsByTopic].length
  );
  return questions[questionsByTopic][randomIndex];
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
    
    // Return the correct answer based on question type
    if (!question.hasOptions) {
        return question.answer || question.correctAnswer || 'Ответ не найден.';
    }
    
    // Find and return the correct option text
    const correctOption = question.options?.find((option) => option.isCorrect);
    return correctOption?.text || 'Правильный ответ не найден.';
};


