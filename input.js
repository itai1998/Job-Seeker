function input(question){                                                                                           // we need this function to use input method
    const readline = require('readline').createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return new Promise( res => {
        readline.question(question,(answer)=> {
            res(answer);
            readline.close();
        });
    });
}

module.exports ={input}