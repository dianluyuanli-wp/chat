var fs = require('fs');
//  删除dist文件下的所有js和css
const action = async() => {
    let a = (await fs.readdirSync('./dist')).filter(item => /.*(.css|.js)$/g.test(item));
    for(let i = 0; i < a.length; i++) {
        fs.unlink('./dist/' + a[i], function(err) {
            if (err) {
                return console.error(err);
                }
                console.log(a[i] + " 删除成功！");
            });
    }
}

action();