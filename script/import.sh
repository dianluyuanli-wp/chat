# 引入外面bundle文件夹里的东西到dist 虚拟机性能太差，打不了包

#先删除本地的文件
rm -rf ./dist/*.js
rm -rf ./dist/*.css
rm -rf ./dist/*.html

#同步远端代码
git pull origin master

#同步代码容器中的代码
cd ./../bundleChat
git pull origin master

#将容器中的内容复制到dist文件
cd ./../chat
cp -r ./../bundleChat/* ./dist