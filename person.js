const axios = require('axios');
const index = require('./token')
const token = index.token;
const a = require('./input');
const input = a.input



async function checkID(){
    const test = await input('Enter you student ID: ')
    console.log('Your ID is: '+test)
}

checkID()