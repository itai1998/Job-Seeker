const axios = require('axios')
const getInput = require('./input')
const input = getInput.input
const index = require('./token')
const {Select} = require("enquirer");
const token = index.token



const jobOpeningApi = {
    url: 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites',
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${token}`
    }
}

let prompt = new Select({
    name: 'jobPrefer',
    message: 'Select the job you are interested in',
    choices: []
})

let person_name, person_byu_id
let side, title, search
let job_name

async function getStudentId(){
        try{
            let id = await input('Enter you student ID: ')
            const options ={
                url: `https://api-sandbox.byu.edu:443/byuapi/persons/v3/${id}`,
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }
            const body = await axios(options)
            const person = body.data.basic
            person_byu_id = person.byu_id.value
            name = person.name_fnf.value
            return id
        } catch (e){
            console.log(`The ID is not existed. Please enter the valid ID and check if the token is valid.`)
        }
}

async function getStudentName(id){
        try{
            const options ={
                url: `https://api-sandbox.byu.edu:443/byuapi/persons/v3/${id}`,
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }
            const body = await axios(options)
            const person = body.data.basic
            person_byu_id = person.byu_id.value
            name = person.name_fnf.value
            let question = await input(`Is ${name} your name? y or n >>> `)
            if(question==='y' || question ==='Y'){
                console.clear()
                person_name = name
                return name;
            }
        } catch (e){
            console.log(`The ID is not existed. Please enter the valid ID and check if the token is valid.`)
        }
}

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
            //await returnToMenu()
        }
    }
}

async function selectJob(){
    if(side !=null && title != null){
        //let y = await db.viewDesirejob(person_byu_id)
        await console.clear()
        await prompt.run()
            .then(async answer=>{
                job_name = answer
                // if(y.includes(answer)){
                //     console.clear()
                //     console.log('The data has already existed in the database. Please choose other job preference.')
                //     console.log(' ')
                // }else{
                //     await db.addToTable(person_byu_id,person_name,search,answer,'https://www.byu.edu/search-all?q='
                //         +answer.replaceAll(' ','%20'))
                // }
            }).catch(console.error)
    }
}

async function addJob(){
    await showDepartment()
    await showJobOpening()
    await jobChoice()
    await selectJob()
    console.log(job_name)
}

//addJob()
module.exports ={getStudentName, getStudentId}
