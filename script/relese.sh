# 自动化运维之一键发版

#杀掉老的node进程
kill -s 9 `pgrep node`

#引入新文件
./script/import.sh

#开启node服务器和api服务器
node ./bin/www &
node ./../apiTest/app.js &