// Шаблон регулярного выражения
const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// Секретный ключ
const SICRET_KEY = '2c06af7633b29f66ac6c88acb26251e9730818f8e6492a6426aba22d11761dc6';

// Сохранение статусов ответов в константы
const OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_BAD_REQUEST_STATUS = 400;
const NOT_FOUND_PAGE_STATUS = 404;
const SERVER_ERROR_STATUS = 500;

module.exports = {
  SICRET_KEY,
  URL_PATTERN,
  OK_STATUS,
  HTTP_CREATED_STATUS,
  HTTP_BAD_REQUEST_STATUS,
  NOT_FOUND_PAGE_STATUS,
  SERVER_ERROR_STATUS,
};
