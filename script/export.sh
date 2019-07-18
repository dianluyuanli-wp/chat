# 把本地dist文件里的东西导入到外围bundleChat文件夹里
rm -rf ./../bundleChat/*.js
cp -r ./dist/*.js ./../bundleChat
cp -r ./dist/*.css ./../bundleChat
cd ./../bundleChat
git commit -am 'fix: script push'
git push origin master