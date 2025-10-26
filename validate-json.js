import fs from 'fs';
import questions from './questions.json' with { type: 'json' };

console.log('✅ JSON is valid!');
console.log(`Found ${Object.keys(questions).length} topics:`);
Object.keys(questions).forEach(topic => {
    console.log(`- ${topic}: ${questions[topic].length} questions`);
});
