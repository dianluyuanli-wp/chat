# 把本地dist文件里的东西导入到外围bundleChat文件夹里

#清空容器文件夹中的文件
rm -rf ./../bundleChat/*.js
rm -rf ./../bundleChat/*.css
rm -rf ./../bundleChat/*.html

#复制本地打包内容到容器文件夹
cp -r ./dist/*.js ./../bundleChat
cp -r ./dist/*.css ./../bundleChat
cp -r ./dist/*.html ./../bundleChat

#同步变化，提交到仓库
cd ./../bundleChat
git add .
git commit -am 'fix: script push'
git push origin master