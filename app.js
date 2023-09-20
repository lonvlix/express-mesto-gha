const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes/router');

// Определение порта для работы бекенда
const { PORT = 3000 } = process.env;

// Создание экземпляра приложения Express.js
const app = express();

// Подключение helmet используется для применения helmet
// в качестве промежуточного обработчика (middleware) в приложении Express.js.
app.use(helmet());

// Отключение заголовка "x-powered-by"
app.disable('x-powered-by');

// Парсинг JSON-запросов
app.use(express.json());

// Установка значения для свойства user в объекте req
app.use((req, res, next) => {
  req.user = {
    _id: '65095c02c416aab0d44c47c6',
    /*
{
    "name": "Elizaveta",
    "about": "Frontend-Developer",
    "avatar": "https://media.istockphoto.com/id/1367357589/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B5-%D1%81%D0%B5%D1%80%D0%B4%D1%86%D0%B5-%D0%B2-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%D0%BD%D0%B5%D0%B1%D0%B0-%D0%BD%D0%B0-%D0%B7%D0%B0%D0%BA%D0%B0%D1%82%D0%B5-%D0%BA%D1%80%D0%B0%D1%81%D0%B8%D0%B2%D1%8B%D0%B9-%D0%BF%D0%B5%D0%B9%D0%B7%D0%B0%D0%B6-%D1%81-%D1%86%D0%B2%D0%B5%D1%82%D0%B0%D0%BC%D0%B8-%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D0%BD%D1%8B%D0%B9-%D1%84%D0%BE%D0%BD-%D1%81-%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC.jpg?b=1&s=612x612&w=0&k=20&c=cSc-zEW78iLrAxekgwvFbsmniBnw3AZ_ziKL6e0kZos=",
    "_id": "65095c02c416aab0d44c47c6"
}
    */
  };
  next();
});

// Подключение маршрутов приложения
app.use(routes);

// Подключение к базе данных Mongodb и таблице mestodb
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД успешно подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к БД, проверьте правильность подключения пути');
  });

// Запуск сервера на 3000 порту
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
