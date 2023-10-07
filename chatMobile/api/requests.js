import { API_URI, API_URI_DEV } from "@env"
import axios from 'axios'

module.exports = 
{
    send : async function(request) 
    {
        let result = await axios({
            url: __DEV__ ? API_URI_DEV + '/api' : API_URI + '/api',
            method: 'GET',
            params: { type: request },
        })
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
        
        return result
    },
    sendParam : async function(request, param, form)
    {
        let result = await axios({
            url: __DEV__ ? API_URI_DEV + '/api' : API_URI + '/api',
            method: 'GET',
            params: { type: request, [param]: form },
        })
        .then(res => { return res.data })
        .catch(err => { console.log(err) })

        return result
    }
}