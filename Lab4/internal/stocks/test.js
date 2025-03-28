const {DBConnector} = require('../../modules/DBConnector');

// 1. Создаем экземпляр коннектора
const connector = new DBConnector('data.json');

// 2. Пытаемся прочитать файл
try {
  const data = connector.readFile();
  console.log('Файл успешно прочитан:', JSON.parse(data));
} catch (error) {
  console.error('Ошибка чтения файла:', error.message);
}

// 3. Пытаемся записать в файл (опционально)
try {
  connector.writeFile(JSON.stringify({ updated: true }, null, 2));
  console.log('Файл успешно записан');
} catch (error) {
  console.error('Ошибка записи файла:', error.message);
}