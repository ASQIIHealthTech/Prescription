FROM mysql:latest


ENV MYSQL_DATABASE prescription
ENV MYSQL_ROOT_PASSWORD root 

COPY init_user.sql  /docker-entrypoint-initdb.d/
COPY custom.cnf /etc/mysql/conf.d 


