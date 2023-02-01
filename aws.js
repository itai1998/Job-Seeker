/**
 * @file AWS.js
 * @description This file contains the functions that are used to connect to the AWS database
 * @author I-Tai Lin
 * Last edited: January, 31 - added jsdocs
 */

const AWS = require('aws-sdk')
AWS.config.update({region: 'us-west-2'})
const ssm = new AWS.SSM()

const usernameParam ={
    Name: '/I-Tai-technical-challenge/dev/database_username',
    WithDecryption: true
}

const passwordParam = {
    Name: '/I-Tai-technical-challenge/dev/database_password',
    WithDecryption: true
}

let aws_name = ssm.getParameter(usernameParam).promise()
aws_name = aws_name.then(message=>{
    return message.Parameter
})

let aws_password = ssm.getParameter(passwordParam).promise()
aws_password = aws_password.then(message=>{
    return message.Parameter
})


async function test(){
    let x = await aws_name
    console.log(x.Value)
}

exports.aws_name = aws_name
exports.aws_password = aws_password







