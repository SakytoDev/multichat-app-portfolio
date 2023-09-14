const fs = require('fs')

const express = require('express'),
    app = express()

const https = require('https'),
    server = https.createServer({ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") }, app)

const { Server } = require("socket.io"),
    io = new Server(server)

const session = require("express-session")
const cookieParser = require("cookie-parser")

const config = require("./config")

module.exports = {
    app,
    io,

    setup : function() 
    {
        app.set('view engine', 'ejs')
        app.use('/media', express.static('media'))

        app.use(cookieParser())
        app.use(session({
            secret: config.sessionSecret,
            saveUninitialized: true,
            resave: true,
            cookie: { httpOnly: false, sameSite: 'none', secure: true }
        }))
        
        app.get('/', (req, res) => {
            res.render('main', { title: config.title })
        })

        io.on('connection', (socket) => {
            //console.log('Подключён пользователь')
            
            socket.on('disconnect', () => {
                //console.log('Пользователь отключён')
            })
        })
        
        server.listen(config.port, config.hostname, () => {
            console.log(`Сервер запущен: https://${config.hostname}:${config.port}`)
        })
    }
}