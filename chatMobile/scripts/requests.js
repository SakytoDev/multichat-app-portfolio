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
    sendForm : async function(request, _form)
    {
        let result = null

        await axios ({
            url: 'https://192.168.10.8:3000/request',
            method: 'GET',
            params: { type: request, form: _form },
        })
        .then(res => { result = res.data })
        .catch(err => { console.log(err) })

        return result
    }
}