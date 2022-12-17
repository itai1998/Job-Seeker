//*********Technical Challenge Top**************/
const axios = require('axios')

const AWS = require('aws-sdk')
AWS.config.update({region: 'us-west-2'})
const ssm = new AWS.SSM()


// set credential variable
let username, password

// Set password from AWS
const passwordParam = {
    Name: '/I-Tai-technical-challenge/dev/database_password',
    WithDecryption: true
}

ssm.getParameter(passwordParam).promise()
    .then(data => {
        const credential = data.Parameter.Value
        console.log(credential)
        password=credential
    })

// Set username from AWS
const usernameParam ={
    Name: '/I-Tai-technical-challenge/dev/database_username',
    WithDecryption: true
}

ssm.getParameter(usernameParam).promise()
    .then(data => {
        const credential = data.Parameter.Value
        console.log(credential)
        username=credential
    })


//Require postgres to connect the code to SQL
//const axios = require('axios')
const { Client } = require('pg')


//Params for SQL Code
const params ={
    host: 'localhost',
    user: null,
    password: null,
    database: 'pgdb',
    port: 5432
}


//Add To SQL Table by using BYU's Person's API
async function addToTable (byu_id, name, phoneNumber, address){
    try{
        console.log(username)
        params.user = username
        params.password = password
        console.log('Adding something to the table...')
        const client = new Client(params)
        await client.connect()
        const queryText = 'INSERT INTO MY_TABLE (BYU_ID, FULL_NAME, PHONE_NUMBER, ADDRESS) VALUES ($1, $2, $3, $4)'
        const values =[byu_id, name, phoneNumber, address]
        await client.query(queryText, values)
        await client.end()
        console.error('Successfully added a new item on the local database')
    } catch(e){
        console.error('Unable to add a new item on the local database')
        console.log(e)
        throw e
    }
}

//"Get" API from url
//Get BYU's Person's API
const options = {
    url: 'https://api-sandbox.byu.edu:443/byuapi/persons/v3/452999669',
    method: 'GET',
    headers: {
        'Authorization' : 'Bearer BwlraMfIYjbd17eSWjjSd25D8IplrBxQJ-Pw-bFQhiI.1xkp8nwzjXiY-18NuAG2NS_DY7Vx98-ntDzFMeBMp9g'
    }
}


// Get all the information
// Add everything to the table
async function main(){
    let byu_id, name, phoneNumber, address
    try{
        // get id and name
        let body = await axios(options)
        const person = body.data.basic
        byu_id = person.byu_id.value
        name = person.name_fnf.value
        console.log(byu_id)
        console.log(name)

        // get phone number
        options.url = 'https://api-sandbox.byu.edu/byuapi/persons/v3/452999669/phones'
        body = await axios(options)
        const phones = body.data.values[0]
        phoneNumber = phones.lookup_number.value
        console.log(phoneNumber)

        // get address
        options.url = 'https://api-sandbox.byu.edu/byuapi/persons/v3/452999669/addresses'
        body = await axios(options)
        const addresses = body.data
        address = addresses.values[0].address_line_1.value + " " + addresses.values[0].address_line_2.value
        console.log(address)

        // add everything to the table
        await addToTable(byu_id, name, phoneNumber, address)
        console.log('this is for test')
    } catch (e){
        console.log('An error occured in one of the calls')
        throw e
    }
}
main()


//Print the Person's information out and add to the table (Promise Chain way)
// let byu_id, name, phoneNumber, address
// axios(options)
//     .then((body) =>{
//         const person = body.data.basic
//         byu_id = person.byu_id.value
//         name = person.name_fnf.value
//         console.log(byu_id)
//         console.log(name)
//         options.url = 'https://api-sandbox.byu.edu/byuapi/persons/v3/452999669/phones'
//         return axios(options)
//     }).then((body) => {
//         const phones = body.data.values[0]
//         phoneNumber = phones.lookup_number.value
//         console.log(phoneNumber)
//         options.url = 'https://api-sandbox.byu.edu/byuapi/persons/v3/452999669/addresses'
//         return axios(options)
//     }).then((body) => {
//     const addresses = body.data
//     address = addresses.values[0].address_line_1.value + " " + addresses.values[0].address_line_2.value
//     console.log(address)
//     }).then((_) =>{
//     //addToTable(byu_id, name, phoneNumber, address)
//     console.log('This is for testing')
//     })

//     .catch(error => {
//     console.log(error)
// })







//*******************Test if the code connect to the SQL********/
// async function testDatabaseConnectivity (){
//     try{
//         console.log('Testing connection to local database')
//         const client = new Client(params)
//         await client.connect()
//         const result = await client.query('SELECT 1 + 1 as test')
//         console.log(result.rows)
//         await client.end()
//     } catch(e){
//         console.error('Unable to connect to local database')
//         throw e
//     }
// }
//
// testDatabaseConnectivity()
