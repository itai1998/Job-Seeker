//Require postgres to connect the code to SQL
const axios = require('axios')
const { Client } = require('pg')
const { Select, AutoComplete } = require('enquirer')
const getInput = require('./input')
const input = getInput.input
const db = require('./database')
const api = require('./api')
const {resetSelectJob} = require("./api");

let person_name, person_byu_id

// get student's name and byu_id
async function person(){
    while(true){
        person_byu_id = await api.getStudentId()
        if (person_byu_id===undefined){
            continue
        }
        person_name = await api.getStudentName(person_byu_id)
        if(person_name===undefined){
            continue
        }
        break
    }
}

// show the list of departments with its job opening name

async function menu(){
    await db.seeTable(person_byu_id)
    console.log(`Please select the action:`  )
    const action = new Select({
        name: 'menu',
        message: 'What action do you want?',
        choices:['Add preferred job', 'Delete specific job', 'Delete all preferred jobs', 'Exit']

    })
    await action.run()
        .then(async answer => {
            if (answer === 'Add preferred job') {
                await addJob()
                await returnToMenu()
            } else if (answer === 'Delete specific job') {
                await removeJob()
                await console.clear()
                await console.log('Successfully deleting the job...')
                await console.log(' ')
                await returnToMenu()
            } else if (answer ==='Delete all preferred jobs') {
                while(true){
                let x = await input('Are you sure you want to delete all the desired jobs from the table? (y/n): ')
                    if(x==='y' || x ==='Y' ){
                        await db.deleteAll(person_byu_id)
                        await console.clear()
                        await console.log('Successful deleting all jobs preference...')
                        await console.log(' ')
                        break
                    }else if(x==='n' || x === 'N'){
                        await console.clear()
                        await console.log('Cancel the action...')
                        await console.log(' ')
                        break
                    }else{
                        continue
                    }
                }
                await returnToMenu()
            } else if(answer==='Exit'){
                console.log('Bye Bye')
            }
        })
}

async function removeJob(){
    const remove = await new AutoComplete({
        name: 'job delete',
        message: 'Select the job that you want to remove.',
        limit: 10,
        choices: await db.viewDesirejob(person_byu_id)
    })
    if(remove.choices.length !=0){
        await remove.run()
            .then(async answer=>{
                await db.delete_db(person_byu_id, answer)
            })
    }else{
        console.clear()
        await console.log('Nothing to delete. Return to menu...')
        await console.log(' ')

    }
}

async function addJob(){
    let sideId =await api.showDepartment()
    if(sideId === '0'){
        console.clear()
    }
    else{
        // let titleId =await api.showJobOpening(sideId)
        // if(titleId === '0'){
        //     console.clear()
        //     await addJob()
        // }else{
        //     let jobCategory =await api.jobChoice(sideId, titleId)
        //     await api.selectJob(person_byu_id, person_name,jobCategory)
        // }
        await addJobToDatabase(sideId)
    }

}

async function addJobToDatabase(SideId){
    let titleId =await api.showJobOpening(SideId)
    if(titleId === '0'){
        console.clear()
        await addJob()
    }else{
        let jobCategory =await api.jobChoice(SideId, titleId)
        let jobSelection = await api.selectJob(person_byu_id, person_name,jobCategory)
        if(jobSelection === 0){
            await resetSelectJob()
            await addJobToDatabase(SideId)
        }
    }
}

async function returnToMenu(){
    console.log('Welcome back '+person_name)
    await api.resetSelectJob()
    await menu()
}

async function all(){
    await db.testDatabaseConnectivity()
    console.log(' ')
    await person()
    if(person_name !==undefined && person_byu_id !== undefined){
        console.log(person_name+'! welcome to BYU Job Seeker. BYU Job Seeker allows students at BYU to find their desired job on campus by selecting the departments and job categories.')
        console.log(' ')
        await menu()
    }
}

all()
