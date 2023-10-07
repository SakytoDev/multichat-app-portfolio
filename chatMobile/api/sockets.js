import io from 'socket.io-client'

let singleton

module.exports = {
    InitSocket: function() {
        singleton = io('https://website-backend-twkq.onrender.com')
        //console.log("Socket running")
    },
    GetSingleton: () => singleton
}