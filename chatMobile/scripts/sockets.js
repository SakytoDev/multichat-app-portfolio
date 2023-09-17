import io from 'socket.io-client'

let singleton

module.exports = {
    InitSocket: function() {
        singleton = io('https://192.168.10.8:3000')
        console.log("Socket running")
    },
    GetSingleton: () => singleton
}