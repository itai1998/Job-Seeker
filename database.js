const { Client } = require('pg')
const a = require('./input')
const input = a.input
const {aws_name, aws_password} = require("./aws");

const params ={
    host: 'localhost',
    user: null,
    password:null,
    database: 'pgdb',
    port: 5432
}

// Test if the code connects to the database
async function testDatabaseConnectivity (){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        console.log('Testing connection to local database')
        const client = new Client(params)
        await client.connect()
        const result = await client.query('SELECT 1 + 1 as test')
        console.log(result.rows)
        await client.end()
        console.log('Successfully connected to darker database...')
    } catch(e){
        console.error('Unable to connect to local database. Please check the set up...')
        throw e
    }
}

// Add the data to the database
async function addToTable (byu_id, name, job_category, desired_job_name,job_link){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        console.log('Adding something to the table...')
        const client = new Client(params)
        await client.connect()
        const queryText = 'INSERT INTO job (BYU_ID, NAME, JOB_CATEGORY, DESIRED_JOB_NAME, JOB_LINK) VALUES ($1, $2, $3, $4, $5)'
        const values =[byu_id, name, job_category, desired_job_name, job_link]
        await client.query(queryText, values)
        await client.end()
        console.error('Successfully added a new item on the local database')
        console.log(' ')
    } catch(e){
        console.error('Unable to add a new item on the local database')
        console.log(e)
        throw e
    }
}

// create a new table (for testing right now)
async function createToTable(){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        const client = new Client(params)
        await client.connect()
        const queryText =
            'CREATE TABLE job ' +
            '(byu_id VARCHAR(9) NOT NULL,' +
            'name VARCHAR(9) NOT NULL,' +
            'job_category VARCHAR(100),' +
            'desired_job_name VARCHAR(100) NOT NULL,' +
            'job_link VARCHAR(500));'
        await client.query(queryText)
        await client.end()
        console.log('Successfully created table')
    } catch(e) {
        console.log(e)
    }
}

// show the table
async function seeTable(byuId) {
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        const client = new Client(params)
        await client.connect()
        const queryText = `SELECT * FROM job WHERE byu_id = '${byuId}';`
        let a = await client.query(queryText)
        await client.end()
        a = a.rows
        if(a.length === 0){
            console.log('You do not have any preferred job right now.')
        }else{
            console.log('You can see more job opening details by click the job_link')
            console.log('or')
            console.log('Search enter job_category at BYU Job Board: https://hrms.byu.edu/psc/ps/PUBLIC/HRMS/c/HRS_HRAM.HRS_APP_SCHJOB.GBL?Page=HRS_APP_SCHJOB&Action=U&FOCUS=Employee&SiteId=60')
            console.log(' ')
            console.log('Here is your prefer jobs:')
            console.table(a)
            return false
        }
    } catch (e){
        if(e){
            console.log(`Table doesn't exist yet. Creating table...`)
            await createToTable()
        }
        console.log('Successfully created table! Please go back to the main menu!')
        return false

    }
}

async function delete_db(byu_id, jobs){
    await testDatabaseConnectivity()
        try{
            params.user = await aws_name.then(i=>i.Value)
            params.password = await aws_password.then(i=>i.Value)
            console.log('Deleting job from table...')
                const client = new Client(params)
                await client.connect()
                const queryText = `DELETE FROM job WHERE byu_id = '${byu_id}' AND desired_job_name = '${jobs}';`
                await client.query(queryText)
                await client.end()
                console.log('Successfully delete the prefer job')

        } catch (e){
            console.error('Unable to delete the prefer job')
            console.error(e)
        }
}


// Delete all data of the student's job
async function deleteAll(byuId){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        console.log('Deleting history...')
        const client = new Client(params)
        await client.connect()
        const queryText = `DELETE FROM job WHERE byu_id = '${byuId}';`
        await client.query(queryText)
        await client.end()
        console.log('Successfully delete all the history')
    }catch (e){
        console.log('Unable to delete item. Please ty again later.')
        throw e
    }
}

async function viewDesirejob(byuid) {
    let job
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        const client = new Client(params)
        await client.connect()
        const queryText = `SELECT desired_job_name FROM job WHERE byu_id = '${byuid}';`
        let a = await client.query(queryText)
        await client.end()
        job = a.rows.map(obj => obj.desired_job_name)
    }catch (e){
        throw 'you have not chosen any desired job yet'
    }
    return(job)
}

module.exports = {testDatabaseConnectivity, createToTable, addToTable, seeTable, delete_db, deleteAll, viewDesirejob}