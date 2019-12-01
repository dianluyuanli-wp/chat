const chalk = require('chalk');
const exec = require('child_process').exec;
const cp = require('child_process');

const stdin = process.stdin;
const stdout = process.stdout;
const gWord = chalk.green;
const rWord = chalk.red;

const contents = ['1、show files tree', '2、say hello to the world', '3、Release Edition', '4、Export Out Files', 
    '5、build project',
    '6、Exit'];
console.log(chalk.yellow('Choose what you want to do, enter number please:'));
contents.forEach(item => {
    console.log(gWord(item));
})
stdin.resume();
stdin.on('data', async function(data) {
    //  输入获得的是buffer 对象，不能直接使用，否则会有问题， 貌似window下和linux下的格式不对应，linux下应该为slice(0,-1)
    const enterString = data.toString().slice(0,-1);
    if (!/[0-9]+$/.test(enterString)) {
        console.log(rWord('Input Words is not Number!'));
        return ;
    }
    const funcMap = {
        1: () => getWrapperPromise('node script/allPath.js'),
        2: () => { console.log(rWord('hello World!')) },
        3: () => getWrapperPromise('bash ./script/relese.sh'),
        4: () => getWrapperPromise('bash ./script/export.sh'),
        5: () => getWrapperPromise('babel-node ./bundle'),
        6: () => {}
    }
    const targetFunc = funcMap[enterString];
    if (targetFunc) {
        await targetFunc();
        enterString !== '5' && console.log(gWord('Complete Task!'));
        stdin.pause();
    } else {
        console.log(rWord('please enter valid number!'));
    }
})

const getWrapperPromise = (script) => new Promise((resolve, reject) => {
    exec(script, function(error, stdout, stderr) {
        if(error) {
            console.error('error: ' + error);
            return;
        }
        console.log(stdout);
        resolve();
        // console.log('stderr: ' + typeof stderr);
    })
});