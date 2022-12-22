//*********Technical Challenge Top**************/
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
        //console.log(credential)
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
        //console.log(credential)
        username=credential
    })


//Require postgres to connect the code to SQL
const axios = require('axios')
const { Client } = require('pg')
const { Select } = require('enquirer')
const getInput = require('./input')


//Params for SQL Code
const params ={
    host: 'localhost',
    user: null,
    //user:process.env.user,
    //password: process.env.password,
    password: null,
    database: 'pgdb',
    port: 5432
}

// Select enquirer
const prompt = new Select({
    name: 'color',
    message: 'Select the job you are interested in',
    choices: []
})


//Add To SQL Table by using BYU's Person's API
async function addToTable (byu_id, name, phoneNumber, address){
    try{
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
        'Authorization' : 'Bearer ziFs7_nK4bkx8oojD3kNcXJaLRI6If_qGsZsGuf-DVw.--BLoarsoXu8Hc0PUD5TNi3_0eC6nuiiF62u21nGmfQ'
    }
}

// "Get" Job Opening API
const jobOpeningApi = {
    url: 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites',
    method: 'GET',
    headers: {
        'Authorization' : 'Bearer ziFs7_nK4bkx8oojD3kNcXJaLRI6If_qGsZsGuf-DVw.--BLoarsoXu8Hc0PUD5TNi3_0eC6nuiiF62u21nGmfQ'
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
        //await addToTable(byu_id, name, phoneNumber, address)
        console.log('this is for test')
    } catch (e){
        console.log('An error occured in one of the calls')
        throw e
    }
}


/****************My Code*************************/
let side, test

// show the list of departments with its job opening name
async function jobOpening(){
    try{
        // get list of department
        let body = await axios(jobOpeningApi)
        const job = body.data.sites
        console.log('Here are the departments that have job opening:')
        console.log('Enter the Side ID to see detail information ')
        console.log(' ')
        for(let i=0; i<job.length; i++){
            console.log('Side ID: '+job[i].site_id +'-'+ job[i].site_description)
        }

    } catch(e){
        console.log('An error occured in printing job 1opening API')
        throw e
    }
}

async function jobDetail(){
    try{
        jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/' +side+ '/job_families'
        let body = await axios(jobOpeningApi)
        const jobList = body.data.job_families
        console.log('')
        if(jobList.length ===0){
            console.log('Sorry, no job available for this department so far. Please try other departments.')
            reader.close()
        }else {
            for (let i = 0; i < jobList.length; i++) {
                console.log('Title ID: ' + jobList[i].job_template_id + ' --' + jobList[i].job_title)
            }
        }
    }catch(e){
        console.error(e)
    }
}

async function jobChoice(){
    try{
        jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/'+ side+'/job_families/' +test+ '/job_postings'
        let body = await axios(jobOpeningApi)
        const jobList = body.data.job_openings

        for(let i=0; i<jobList.length; i++){
            //console.log('Opening ID: ' +jobList[i].opening_id + ' --'+jobList[i].posting_title)
            prompt.choices.push(jobList[i].posting_title)
        }
    }catch(e){
        console.log(e)
    }
}


function select(){
    prompt.run()
        .then(answer => console.log('Cope the url to see more detail: https://www.byu.edu/search-all?q='+answer.replaceAll(' ','%20')))
        .catch(console.error)
}


async function all(){
    await jobOpening()
    side = await getInput.input('Enter the side ID to see the job opening: ')
    await jobDetail()
    test = await getInput.input('Enter the title ID: ')
    await jobChoice()
    select()

    //badInput()

}

all()



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
