//Require postgres to connect the code to SQL
const axios = require('axios')
const { Client } = require('pg')
const { Select, AutoComplete } = require('enquirer')
const getInput = require('./input')
const input = getInput.input
const index = require('./token')
const token = index.token
const db = require('./database')
const api = require('./api')


//"Get" API from url
//Get BYU's Person's API
const options = {
    url: 'https://api-sandbox.byu.edu:443/byuapi/persons/v3/452999669',
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${token}`
    }
}

// "Get" Job Opening API
const jobOpeningApi = {
    url: 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites',
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${token}`
    }
}

// Select enquirer
let prompt = new Select({
    name: 'jobPrefer',
    message: 'Select the job you are interested in',
    choices: []
})

/****************My Code*************************/
let person_name, person_byu_id
let side, title, search

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
async function showDepartment(){
        try{
            // get list of department
            jobOpeningApi.url ='https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites'
            let body = await axios(jobOpeningApi)
            const job = body.data.sites
            console.log('Here are the departments at BYU:')
            console.log('Enter the Side ID to see detail information ')
            console.log(' ')
            for(let i=0; i<job.length; i++){
                console.log('Side ID: '+job[i].site_id +'-'+ job[i].site_description)
            }
            side = await input('Enter the side ID to see the job opening: ')

        } catch(e){
            console.log('An error occured in printing job opening API')
        }
}

async function showJobOpening(){
    try{
        console.clear()
        jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/' +side+ '/job_families'
        let body = await axios(jobOpeningApi)
        const jobList = body.data.job_families
        console.log('')
        if(jobList.length ===0){
            console.log('Sorry, no job available for this department right now. Please try other departments.')
            console.log(' ')
            side = null
        }else {
            console.log('Here are the job category. Please enter the Title ID to see the job opening.')
            console.log(' ')
            for (let i = 0; i < jobList.length; i++) {
                console.log('Title ID: ' + jobList[i].job_template_id + ' --' + jobList[i].job_title)
            }
        }
        if(side != null){
            title = await input('Enter the title ID: ')
        } else{
            title = null
        }
    }catch(e){
        console.error('You do not enter the Title ID! Return to the menu...')
    }
}

async function jobChoice(){
    if(side!=null && title!=null){
        try{
            let body = await axios(jobOpeningApi)
            const jobTitle = body.data.job_families
            for (let i = 0; i < jobTitle.length; i++) {
                if(Number(title) === jobTitle[i].job_template_id){
                    search = jobTitle[i].job_title
                    break
                }
            }
            jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/'+ side+'/job_families/' +title+ '/job_postings'
            body = await axios(jobOpeningApi)
            const jobList = body.data.job_openings

            if(jobList.length===0){
                console.clear()
                console.log('Sorry, the Title ID doesn\'t existed or the position is not available right now. Please try other departments.')
                console.log(' ')
                title = null
            }else{
                for(let i=0; i<jobList.length; i++){
                    console.log('Opening ID: ' +jobList[i].opening_id + ' --'+jobList[i].posting_title)
                    prompt.choices.push(jobList[i].posting_title)
                }
            }
        }catch(e){
            console.clear()
            console.error('You do not enter the Title ID! Return to the menu...')
            console.log(' ')
            await returnToMenu()
        }
    }
}

async function selectJob(){
    if(side !=null && title != null){
        let y = await db.viewDesirejob(person_byu_id)
        await console.clear()
        await prompt.run()
            .then(async answer=>{
                if(y.includes(answer)){
                    console.clear()
                    console.log('The data has already existed in the database. Please choose other job preference.')
                    console.log(' ')
                }else{
                    await db.addToTable(person_byu_id,person_name,search,answer,'https://www.byu.edu/search-all?q='
                        +answer.replaceAll(' ','%20'))
                }
            }).catch(console.error)
    }
}

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
    await showDepartment()
    await showJobOpening()
    await jobChoice()
    await selectJob()
}

async function returnToMenu(){
    console.log('Welcome back '+person_name)
    await resetSelectJob()
    await menu()
}

async function resetSelectJob(){
     prompt = new Select({
        name: 'jobPrefer',
        message: 'Select the job you are interested in',
        choices: []
    })
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
