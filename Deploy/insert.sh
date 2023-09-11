#! /bin/bash


while true; do 
    BACKEND_URL=nslookup $"BACKEND" | grep 'Address:' | awk '{print $2}' | sed -n '2p'; 
    if [ -n $"BACKEND_URL" ]; then 
      echo "Resloved IP address $BACKEND_URL"
      break
    else
      echo "Waiting for DNS resolution..." 
      sleep 1
    fi 
done


echo "The backend URL is : $BACKEND_URL"

until curl -sSf $BACKEND_URL:3030/health; do
  echo "Waiting for Express app to become ready... on $BACKEND_URL:3030/healt"
  sleep 1
done

until mysqladmin ping -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD"; do
  echo "Waiting for MySQL to start..."
  sleep 1
done

until mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE;" -e "DESCRIBE $TABLE_NAME;";
do
    echo "waiting for ORM to create schema";
    sleep 10
done

echo "Executing the init_schema sql script"
mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" $MYSQL_DATABASE -e "SET GLOBAL FOREIGN_KEY_CHECKS=0"; 
mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" $MYSQL_DATABASE < ../init_schema.sql
mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" $MYSQL_DATABASE -e "SET GLOBAL FOREIGN_KEY_CHECKS=1"; 
echo "Database has been initialized"
    