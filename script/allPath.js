//  遍历打印出当前文件路径树
var fs = require('fs');

let tree = {}
const getPlaceStr = (len) => new Array(len).fill('').map(item => ' ').join('');
function recusion(path, parentNode, placeLen) {
    let pathArray = fs.readdirSync(path);
    let length = pathArray.length;
    for (let i = 0; i < length; i++) {
        let item = pathArray[i];
        let newPath = path + '/' + item;
        if (fs.statSync(newPath).isDirectory() && item !== 'node_modules' && item.slice(0,1) !== '.') {
            parentNode[item] = {};
            process.stdout.write(getPlaceStr(placeLen) + '|_____'+ item + '\n');
            recusion(newPath, parentNode[item], item.length + placeLen + 6);
        } else {
            process.stdout.write(getPlaceStr(placeLen) + '|_____' + item + '\n');
            parentNode[item] = item;
        }
    }
}
recusion('.', tree, 0);
// console.log(tree);
// process.stdout.write('|_');
// process.stdout.write('\n')

