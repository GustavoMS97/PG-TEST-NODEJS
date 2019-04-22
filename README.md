# PG-TEST-NODEJS

## Configuração inicial do projeto

- Rodar no MySql os seguintes comandos
  - CREATE DATABASE pg_test_nodejs;
  - CREATE USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY '1qaz2wsx3edc';
  - GRANT ALL PRIVILEGES ON *.* TO 'dev'@'localhost' WITH GRANT OPTION;
- Na pasta do projeto, rodar os seguintes comandos
    -   ```bash
        npm install
        ```
    -   ```bash 
    node_modules/.bin/sequelize db:migrate
        ```


