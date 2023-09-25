import axios from 'axios'

module.exports = 
{
    send : async function(request) 
    {
        let result = null

        await axios ({
            url: 'https://192.168.10.8:3000/request',
            method: 'GET',
            params: { type: request },
        })
        .then(res => { result = res.data })
        .catch(err => { console.log(err) })

        return result
    },
    sendParam : async function(request, param, form)
    {
        let result = null

        await axios ({
            url: 'https://192.168.10.8:3000/request',
            method: 'GET',
            params: { type: request, [param]: form },
        })
        .then(res => { result = res.data })
        .catch(err => { console.log(err) })

        return result
    }
}