/* eslint-disable no-console */
// подключение express
const express = require('express');
const mongoose = require('mongoose');
// создаем объект приложения
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('база данных подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к базе данных');
  });

// определяем обработчик для маршрута "/"
app.get('/', (req, res) => {
  // отправляем ответ
  res.send('<h2>Привет Express!</h2>');
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
