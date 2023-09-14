const database = require("./modules/database")
const server = require("./modules/server")
const ajax = require("./modules/ajax")
const sockets = require("./modules/sockets")

// Запуск базы данных
database.setup()

// Запуск сервера
server.setup()

// Запуск AJAX
ajax.setup()

// Запуск запросов по сокету
sockets.setup()