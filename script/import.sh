# 引入外面bundle文件夹里的东西到dist 虚拟机性能太差，打不了包
git pull origin master
cd ./../bundleChat
rm -rf *
git pull origin master
cd ./../chat
cp -r ./../bundleChat/* ./dist