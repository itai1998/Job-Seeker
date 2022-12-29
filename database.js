const { Client } = require('pg')
const a = require('./input')
const input = a.input


const params ={
    host: 'localhost',
    user:'itai1998',
    password:'Ether750609',
    database: 'pgdb',
    port: 5432
}

// Test if the code connects to the database
async function testDatabaseConnectivity (){
    try{
        console.log('Testing connection to local database')
        const client = new Client(params)
        await client.connect()
        const result = await client.query('SELECT 1 + 1 as test')
        console.log(result.rows)
        await client.end()
    } catch(e){
        console.error('Unable to connect to local database')
        throw e
    }
}

// Add the data to the database
async function addToTable (id, byu_id, name, desire_job, job_id){
    try{
        console.log('Adding something to the table...')
        const client = new Client(params)
        await client.connect()
        const queryText = 'INSERT INTO job (ID, BYU_ID, NAME, DESIRE_JOB, JOB_ID) VALUES ($1, $2, $3, $4, $5)'
        const values =[id, byu_id, name, desire_job, job_id]
        await client.query(queryText, values)
        await client.end()
        console.error('Successfully added a new item on the local database')
    } catch(e){
        console.error('Unable to add a new item on the local database')
        console.log(e)
        throw e
    }
}

// create a new table (for testing right now)
async function createToTable(params){
    try{
        const client = new Client(params)
        await client.connect()
        const queryText =
            'CREATE TABLE Job ' +
            '(id VARCHAR(50) PRIMARY KEY,' +
            'byu_id VARCHAR(50) NOT NULL,' +
            'name VARCHAR(9) NOT NULL,' +
            'desire_job VARCHAR(50) NOT NULL,' +
            'job_id VARCHAR(50) NOT NULL);'
        await client.query(queryText)
        await client.end()
        console.log('Successfully added')
    } catch(e) {
        console.log(e)
    }
}

// show the table
async function seeTable(params) {
    try{
        const client = new Client(params)
        await client.connect()
        const queryText = 'SELECT * FROM job;'
        let a = await client.query(queryText)
        await client.end()
        a = a.rows
        console.log(a)
    } catch (e){
        console.log(e)
    }
}

async function delete_db(params){
    await testDatabaseConnectivity()
    while(true){
        try{
            await seeTable(params)
            let idToDelete
            idToDelete = await input(`What ID would you like to delete? if you don't, please enter 'n' >>> `)
            if(idToDelete === 'n' || idToDelete === 'N'){
                break
            }else{
                const client = new Client(params)
                await client.connect()
                const queryText = `DELETE FROM job WHERE id = '${idToDelete}'`
                await client.query(queryText)
                await client.end()
                console.log('Successfully delete the prefer job')
                break
            }
        } catch (e){
            console.error('Unable to delete the prefer job')
            console.error(e)
        }
    }
}

//createToTable(params)
//addToTable(2075946,452999669, 'ITAI', 'Software engineer', 1011)
//seeTable(params)
//delete_db(params)

module.exports = {testDatabaseConnectivity, createToTable, addToTable, seeTable, delete_db}