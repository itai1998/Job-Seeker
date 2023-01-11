const axios = require('axios');
const index = require('./token')
const token = index.token;
const a = require('./input');
const input = a.input
let byu_id, name


async function person(){
    while(true){
        try{
            let id = await input('Enter you student ID: ')
            const options ={
                url: `https://api-sandbox.byu.edu:443/byuapi/persons/v3/${id}`,
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }
            const body = await axios(options)
            const person = body.data.basic
            byu_id = person.byu_id.value
            name = person.name_fnf.value
            let question = await input(`Is ${name} your name? y or n >>> `)
            if(question==='y' || question ==='Y'){
                console.clear()
                break
            }

        } catch (e){
            console.log(`The ID is not existed. Please enter the valid ID.`)
            continue
        }
    }
    exports.name = name
    exports.byu_id = byu_id
}

person()
module.exports = {person}
