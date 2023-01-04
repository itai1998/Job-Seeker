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
async function addToTable (byu_id, name, desire_job, job_category,job_id){
    try{
        params.user = await aws_name.then(i=>i.Value)
        params.password = await aws_password.then(i=>i.Value)
        console.log('Adding something to the table...')
        const client = new Client(params)
        await client.connect()
        const queryText = 'INSERT INTO job (BYU_ID, NAME, DESIRE_JOB, JOB_CATEGORY, JOB_ID) VALUES ($1, $2, $3, $4, $5)'
        const values =[byu_id, name, desire_job, job_category, job_id]
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
            'job_category VARCHAR(50),' +
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

// Delete specific row from the table
// async function delete_db(byu_id, jobs){
//     await testDatabaseConnectivity()
//     while(true){
//         try{
//             params.user = await aws_name.then(i=>i.Value)
//             params.password = await aws_password.then(i=>i.Value)
//             await seeTable(byu_id)
//             let jobToDelete
//             jobToDelete = await input(`What ID would you like to delete? if you don't, please enter 'n' >>> `)
//             if(jobToDelete === 'n' || jobToDelete === 'N'){
//                 break
//             }else{
//                 const client = new Client(params)
//                 await client.connect()
//                 const queryText = `DELETE FROM job WHERE byu_id = '${byu_id}' AND desire_job = '${jobToDelete}';`
//                 await client.query(queryText)
//                 await client.end()
//                 console.log('Successfully delete the prefer job')
//             }
//         } catch (e){
//             console.error('Unable to delete the prefer job')
//             console.error(e)
//         }
//     }
// }

async function delete_db(byu_id, jobs){
    await testDatabaseConnectivity()
        try{
            params.user = await aws_name.then(i=>i.Value)
            params.password = await aws_password.then(i=>i.Value)
            console.log('Deleting job from table...')
                const client = new Client(params)
                await client.connect()
                const queryText = `DELETE FROM job WHERE byu_id = '${byu_id}' AND desire_job = '${jobs}';`
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
        const queryText = `SELECT desire_job FROM job WHERE byu_id = '${byuid}';`
        let a = await client.query(queryText)
        await client.end()
        job = a.rows.map(obj => obj.desire_job)
    }catch (e){
        throw 'you have not chosen any desired job yet'
    }
    return(job)
}

//deleteAll(452999660)
//createToTable()
//addToTable(452999669,'ITAI','Web Designer', 'EIS', 1002)
//seeTable(452999669)
//delete_db(452999669)
//testDatabaseConnectivity()
module.exports = {testDatabaseConnectivity, createToTable, addToTable, seeTable, delete_db, deleteAll, viewDesirejob}