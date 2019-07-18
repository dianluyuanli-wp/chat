# 引入外面bundle文件夹里的东西到dist 虚拟机性能太差，打不了包
rm -rf ./dist/*.js
rm -rf ./dist/*.css
git pull origin master
cd ./../bundleChat
git pull origin master
cd ./../chat
cp -r ./../bundleChat/* ./dist