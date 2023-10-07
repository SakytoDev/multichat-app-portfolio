import { API_URI, API_URI_DEV } from '@env';
import io from 'socket.io-client';

let singleton

module.exports = {
    InitSocket: function() {
        singleton = io(__DEV__ ? API_URI_DEV : API_URI)
        //console.log("Socket running")
    },
    GetSingleton: () => singleton
}