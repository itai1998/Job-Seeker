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
    } catch(e){
        console.error('Unable to connect to local database')
        throw e
    }
}

// Add the data to the database
async function addToTable (byu_id, name, desire_job, job_department,job_id){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        console.log('Adding something to the table...')
        const client = new Client(params)
        await client.connect()
        const queryText = 'INSERT INTO job (BYU_ID, NAME, DESIRE_JOB, JOB_DEPARTMENT, JOB_ID) VALUES ($1, $2, $3, $4, $5)'
        const values =[byu_id, name, desire_job, job_department, job_id]
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
            'desire_job VARCHAR(50) NOT NULL,' +
            'job_department VARCHAR(50),' +
            'job_id int NOT NULL);'
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
            console.log('You do not have any prefer job')
        }else{
            console.log(a)
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

async function delete_db(byu_id){
    await testDatabaseConnectivity()
    while(true){
        try{
            params.user = await aws_name.then(i=>i.Value)
            params.password = await aws_password.then(i=>i.Value)
            await seeTable(byu_id)
            let idToDelete
            idToDelete = await input(`What ID would you like to delete? if you don't, please enter 'n' >>> `)
            if(idToDelete === 'n' || idToDelete === 'N'){
                break
            }else{
                const client = new Client(params)
                await client.connect()
                const queryText = `DELETE FROM job WHERE byu_id = '${byu_id}' AND job_id = '${idToDelete}';`
                await client.query(queryText)
                await client.end()
                console.log('Successfully delete the prefer job')
            }
        } catch (e){
            console.error('Unable to delete the prefer job')
            console.error(e)
        }
    }
}

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

//deleteAll(452999660)
//createToTable()
//addToTable(452999669,'ITAI','Web Designer', 'EIS', 1002)
//seeTable(452999669)
//delete_db(452999669)
//testDatabaseConnectivity()
module.exports = {testDatabaseConnectivity, createToTable, addToTable, seeTable, delete_db, deleteAll}