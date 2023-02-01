/**
 * @file api.js
 * @description This handle all the API calls
 * @author I-Tai Lin
 * Last edited: January, 31 - added jsdocs
 */
const axios = require('axios')
const getInput = require('./input')
const input = getInput.input
const index = require('./token')
const {Select} = require("enquirer");
const token = index.token
const db = require('./database')

/**
 * @param JobOpeningApi to get all the department at BYU
 * @param token will get the token from token.js
 */
const jobOpeningApi = {
    url: 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites',
    method: 'GET',
    headers: {
        'Authorization' : `Bearer ${token}`
    }
}

/**
 * Prompts user to select the job
 */
let prompt = new Select({
    name: 'jobPrefer',
    message: 'Select the job you are interested in',
    choices: []
})

/**
 * @global person_byu_id - get the student's BYU ID
 * @global side - get the department's side ID
 * @global title - get the job's title ID
 * @global job_name - get the job's category name
 */
let person_byu_id, side, title, job_name

/**
 * Prompts user to input BYU ID and assigns it to the global variable 'person_byu_id' in index.js
 * @returns id
 */
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

/**
 * Ask the user to verify his or her name and assigns it to the global variable 'person_name' in index.js
 * @param id
 * @returns name
 */
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
                return name;
            }
        } catch (e){
            console.log(`The ID is not existed. Please enter the valid ID and check if the token is valid.`)
        }
}

/**
 * Calls job_openings v1 API and retrieves all departments at BYU
 * @returns side id that the user enter
 */
async function showDepartment(){
    try{
        // get list of department
        jobOpeningApi.url ='https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites'
        let body = await axios(jobOpeningApi)
        const job = body.data.sites
        console.log('Here are the departments at BYU:')
        console.log('Enter the Side ID to see detail information or enter 0 to return to the menu')
        console.log(' ')
        for(let i=0; i<job.length; i++){
            console.log('Side ID: '+job[i].site_id +'-'+ job[i].site_description)
        }
        console.log('Side ID: 0-Go back to the menu')
        side = await input('Enter the side ID to see the job opening: ')
        return side

    } catch(e){
        console.log('An error occured in printing job opening API')
    }
}

/**
 * Calls job_opening_v1_side API and retrieves all the job category according to the side ID
 * @param sideName the side ID that the user enter
 * @returns title
 */
async function showJobOpening(sideName){
    try{
        console.clear()
        jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/' +sideName+ '/job_families'
        let body = await axios(jobOpeningApi)
        const jobList = body.data.job_families
        console.log('')
        if(jobList.length ===0){
            console.log('Sorry, no job available for this department right now. Please try other departments.')
            console.log(' ')
            side = null
        }else {
            console.log('Here are the job categories. Please enter the Title ID to see the job opening or enter 0 to go back to the previous page.')
            console.log(' ')
            for (let i = 0; i < jobList.length; i++) {
                console.log('Title ID: ' + jobList[i].job_template_id + ' --' + jobList[i].job_title)
            }
            console.log('Title ID: 0 --Go back to the previous page')
            console.log('*** Enter nothing to return back to the menu ***')

        }
        if(side != null){
            title = await input('Enter the title ID: ')
            return title
        } else{
            title = null
        }
    }catch(e){
        console.error('You do not enter the Side ID! Return to the menu...')
    }
}

/**
 * Calls job_opening_v1_side_title API and retrieves all the job names according to the department side ID and the job title
 * Push the job names into the {Select} enquirer
 * @param sideId the department side ID that the user enter
 * @param titleId the job title ID that the user enter
 * @returns job_name
 */
async function jobChoice(sideId, titleId){
    if(side!=null && title!=null){
        try{
            let body = await axios(jobOpeningApi)
            const jobTitle = body.data.job_families
            for (let i = 0; i < jobTitle.length; i++) {
                if(Number(title) === jobTitle[i].job_template_id){
                    job_name= jobTitle[i].job_title
                    break
                }
            }
            jobOpeningApi.url = 'https://api-sandbox.byu.edu:443/domains/erp/hr/job_openings/v1/sites/'+ sideId+'/job_families/' +titleId+ '/job_postings'
            body = await axios(jobOpeningApi)
            const jobList = body.data.job_openings

            if(jobList.length===0){
                console.clear()
                console.log('Sorry, the Title ID doesn\'t existed or the position is not available right now. Please try other departments.')
                console.log(' ')
                title = null
            }else{
                for(let i=0; i<jobList.length; i++){
                    // console.log('Opening ID: ' +jobList[i].opening_id + ' --'+jobList[i].posting_title)
                    jobList[i].posting_title = jobList[i].posting_title.replaceAll('\'','\"')
                    prompt.choices.push(jobList[i].posting_title)
                }
                prompt.choices.push('Go Back to The Previous Page')
                prompt.choices.push('Go Back to The Menu Page')
            }
        }catch(e){
            console.clear()
            console.error('You do not enter the Title ID! Return to the menu...')
            console.log(' ')
        }
    }
    return job_name
}

/**
 * Add the student's ID, student's name, and his desired job into the database
 * @param studentId user's BYU ID
 * @param studentName user's name
 * @param job user's desired job
 * @returns {Promise<*>}
 */
async function selectJob(studentId, studentName, job){
    let job_name
    if(prompt.choices.length!=0){
        let y = await db.viewDesirejob(person_byu_id)
        await console.clear()
        await prompt.run()
            .then(async answer=>{
                job_name = answer
                if(y.includes(answer)){
                    console.clear()
                    console.log('The data has already existed in the database. Please choose other job preference.')
                    console.log(' ')
                }
                else if(answer === 'Go Back to The Previous Page'){
                    job_name = 0
                }else if(answer === 'Go Back to The Menu Page'){
                    return 1
                }
                else{
                    // let job = 'https://www.byu.edu/search-all?q=' +answer.replaceAll(' ','%20')
                    // if(job.length >= 90){
                    //     job = 'https://www.byu.edu/search-all?q='
                    // }
                    await db.addToTable(studentId,studentName,job,answer)
                }
            }).catch(console.error)
    }
    return job_name
}

/**
 * Clear the {Select} enquirer's choices
 * @returns {Promise<void>}
 */
async function resetSelectJob(){
    prompt = new Select({
        name: 'jobPrefer',
        message: 'Select the job you are interested in',
        choices: []
    })
}

module.exports ={getStudentName, getStudentId, showDepartment, showJobOpening, jobChoice, selectJob ,resetSelectJob}
