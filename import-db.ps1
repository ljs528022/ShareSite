# ================================================
# MySQL dump 데이터를 Docker 볼륨으로 import
# ================================================

# 임시 MySQL 컨테이너 실행하여 import
docker run --rm `
  --name temp-mysql-import `
  -v sharesiteDB_volume:/var/lib/mysql `
  -v /c/MyDev/ShareSite/sharesiteDB_dump.sql:/sharesiteDB_dump.sql `
  -e MYSQL_ROOT_PASSWORD=1234 `          # ✅ 실제 비밀번호 입력
  mysql:8.0 bash -c `
    exec mysqld_safe
    sleep 10 
    mysql -uroot -p1234 -e "CREATE DATABASE IF NOT EXISTS sharesiteDB;"
    mysql -uroot -p1234 sharesiteDB < /dump.sql
    echo "✅ 데이터 import 완료"
  `