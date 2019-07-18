# 自动化运维之一键发版
kill -s 9 `pgrep node`
./script/import.sh
node ./bin/www &
node ./../apiTest/app.js &