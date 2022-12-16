const axios =  require('axios')

axios.get('https://www.google.com').then(body =>{
    console.log(body.data)
})