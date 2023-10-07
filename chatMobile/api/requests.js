import axios from 'axios'

module.exports = 
{
    send : async function(request) 
    {
        let result = null

        await axios ({
            url: 'https://website-backend-twkq.onrender.com/request',
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
            url: 'https://website-backend-twkq.onrender.com/request',
            method: 'GET',
            params: { type: request, [param]: form },
        })
        .then(res => { result = res.data })
        .catch(err => { console.log(err) })

        return result
    }
}