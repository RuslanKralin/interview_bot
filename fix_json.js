const fs = require('fs');

// Читаем файл
const content = fs.readFileSync('questions.json', 'utf8');

// Находим первое закрытие корневого объекта
const lines = content.split('\n');
const correctLines = [];
let braceCount = 0;
let foundEnd = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  correctLines.push(line);
  
  // Подсчитываем скобки
  for (const char of line) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
  }
  
  // Если вернулись к 0 - нашли конец
  if (braceCount === 0 && i > 0) {
    foundEnd = true;
    break;
  }
}

if (foundEnd) {
  // Записываем только правильную часть
  fs.writeFileSync('questions.json', correctLines.join('\n'), 'utf8');
  console.log('✅ Файл исправлен! Удалено', lines.length - correctLines.length, 'лишних строк');
} else {
  console.log('❌ Ошибка: не найдено корректное закрытие JSON');
}
