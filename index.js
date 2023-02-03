/**
 * BYU Job Seeker
 * A program that allows students at BYU to store their desired jobs on campus by choosing the departments
 * at BYU with the job categories
 * @file index.js
 * @description Control the flow of the program
 * @author I-Tai Lin
 * Last edited: January 27, 2023 -added jsdocs
 */

/**
 * imports node packges qnquirer to prompt for use inputs
 * imports input.js, database.js, and api.js
 */
const { Select, AutoComplete } = require('enquirer')
const getInput = require('./input')
const input = getInput.input
const db = require('./database')
const api = require('./api')
const {resetSelectJob} = require("./api");

/**
 * @global person_name - stores user's full name
 * @global person_byu_id stores user's BYU ID
 */
let person_name, person_byu_id

/**
 * Ask the users to enter their BYU ID until they enter the valid ID. Then asks the users to verify their names
 * Store the users' name and BYU ID into global variables
 * @returns {Promise<void>}
 */
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

/**
 * Displays main menu and navigates based on user's selection
 * @returns {Promise<void>}
 */
async function menu(){
    await db.seeTable(person_byu_id)
    console.log(`Please select the action:`  )
    const action = new Select({
        name: 'menu',
        message: 'What action do you want?',
        choices:['Add preferred job', 'Delete specific job', 'Delete all preferred jobs', 'Exit']

    })
    try{
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
                    process.exit()
                }
            })
    }catch(e){
        console.log('')
    }


}

/**
 * Function to ba called if user selects 'Delete specific job' in menu()
 * Display user's desired job list and prompts user to select
 * The selected job will be removed from the list
 * @returns {Promise<void>}
 */
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

/**
 * Function to be called if user selects 'Add preferred job' in menu()
 * The user will be prompt to enter the department ID, job category ID, and to select the job they like
 * @property sideId - department ID at BYU
 * @returns {Promise<void>}
 */
async function addJob(){
    let sideId =await api.showDepartment()
    if(sideId === '0'){
        console.clear()
    }
    else{
        await addJobToDatabase(sideId)
    }

}

/**
 * Function to be called when the user enter the side Id into the program after they select 'Add preferred job' in menu()
 * The program will show the job title of the department the user choose
 * @param SideId - department ID at BYU
 * @returns {Promise<void>}
 */
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

/**
 * Function to be called and awaits user's selection to return to menu() or exit the program
 * @returns {Promise<void>}
 */
async function returnToMenu(){
    console.log('Welcome back '+person_name)
    await api.resetSelectJob()
    await menu()
}

/**
 * Control the flow of the program
 * @returns {Promise<void>}
 */
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
