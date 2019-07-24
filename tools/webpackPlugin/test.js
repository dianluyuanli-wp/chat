var fs = require('fs');
//  自己的webpack插件 牛逼
const action = async(option) => {
    const { path, exclude } = option;
    function delDir(path, exclude){
        let files = [];
        let hasJump = false;
        if(fs.existsSync(path)){
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                if (exclude && exclude.test(file)) {
                    hasJump = true;
                    return;
                }
                let curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()){
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                    console.log('删除文件 ' + curPath)
                }
            });
            if (!hasJump) {
                fs.rmdirSync(path);
                console.log('删除文件夹 ' + path)
            }
        }
    }
    delDir(path, exclude);
}

function HelloWorldPlugin(options) {
    this.options = {
        ...options
    };
}
HelloWorldPlugin.prototype.apply = function(compiler) {
  //此处利用了 Compiler 提供的 done 钩子函数，作用前面已经说过
  compiler.hooks.entryOption.tap({name: 'HelloWorldPlugin'}, () => {
      console.log('~删除上次打包文件~')
      action(this.options);
  });
};
module.exports = HelloWorldPlugin;